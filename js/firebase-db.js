/**
 * GeoHogar — Firebase Firestore Database Manager
 */

(function() {
  window.normalizePropertyType = function(type) {
    if (!type) return 'Departamento';
    const t = type.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    if (t === 'casa' || t === 'houses' || t === 'house' || t === 'home') return 'Casa';
    if (t === 'departamento' || t === 'depto' || t === 'apartamento' || t === 'apartment' || t === 'apt') return 'Departamento';
    if (t === 'duplex' || t.includes('plex')) return 'Dúplex';
    if (t === 'penthouse') return 'Penthouse';
    if (t === 'ph') return 'PH';
    if (t === 'terreno' || t === 'land' || t === 'lote') return 'Terreno';
    if (t === 'oficina' || t === 'office') return 'Oficina';
    if (t === 'local' || t === 'local comercial' || t === 'store' || t === 'shop') return 'Local';
    if (t === 'galpon' || t === 'deposito' || t === 'warehouse') return 'Galpón';
    if (t === 'estancia' || t === 'campo' || t === 'ranch' || t === 'farm') return 'Estancia';
    
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  if (typeof firebase === 'undefined') {
    console.warn("Firebase SDK is not loaded. Database operating in offline/local-fallback mode.");
    window.firebaseDb = null;
    
    // Define mock sync/subscribe functions that load local files
    window.subscribeProperties = function(callback) {
      if (window._localScrapedProperties && window._localScrapedProperties.length) {
        if (callback) callback(window._localScrapedProperties);
        return;
      }
      fetch('data/propiedades.json')
        .then(r => r.json())
        .then(data => {
          window._localScrapedProperties = data || [];
          window._localScrapedProperties.forEach(p => {
            p.type = window.normalizePropertyType(p.type);
            if (p.isScraped) {
              p.dataSource = 'radar';
            } else {
              p.dataSource = 'estimation';
            }
          });
          window.appData.properties = window._localScrapedProperties;
          if (callback) callback(window._localScrapedProperties);
        })
        .catch(err => {
          console.error("Error loading properties in fallback mode:", err);
          if (callback) callback([]);
        });
    };

    window.subscribeMarketNews = function(callback) {
      if (window.appData && window.appData.marketNews && window.appData.marketNews.length) {
        if (callback) callback(window.appData.marketNews);
        return;
      }
      fetch('data/market-news.json')
        .then(r => r.json())
        .then(data => {
          window.appData = window.appData || {};
          window.appData.marketNews = data || [];
          if (callback) callback(window.appData.marketNews);
        })
        .catch(err => {
          console.error("Error loading news in fallback mode:", err);
          if (callback) callback([]);
        });
    };
    return;
  }

  const db = firebase.firestore();
  window.firebaseDb = db;

  // ===== USER STATE =====
  let currentUserId = null;
  document.addEventListener('geohogar:auth:loggedin', (e) => {
    const user = e.detail.user;
    currentUserId = user.uid;
    console.log("Logged in user ID in Database Manager:", currentUserId);
    
    // Start listening to user specific collections
    initUserSync(user);
  });

  // ===== GEOGRAPHIC BOUNDARY CHECK FOR PARAGUAY =====
  function isPropertyInParaguay(prop) {
    if (!prop) return false;
    
    // Normalize coordinates to numbers
    if (prop.lat !== undefined && prop.lat !== null) prop.lat = parseFloat(prop.lat);
    if (prop.lng !== undefined && prop.lng !== null) prop.lng = parseFloat(prop.lng);
    
    // Check country field
    if (prop.country && prop.country.toLowerCase() === 'argentina') {
      return false;
    }
    
    // Check address for Argentina/non-Paraguay indicators
    const addressLower = (prop.address || '').toLowerCase();
    if (
      addressLower.includes('argentina') || 
      addressLower.includes('buenos aires') || 
      addressLower.includes('rosario') || 
      addressLower.includes('córdoba') || 
      addressLower.includes('cordoba') || 
      addressLower.includes('mendoza')
    ) {
      return false;
    }
    
    // Bounding box for Paraguay: Latitudes [-28.0, -18.0] and Longitudes [-63.0, -53.0]
    if (typeof prop.lat === 'number' && typeof prop.lng === 'number' && !isNaN(prop.lat) && !isNaN(prop.lng)) {
      if (prop.lat < -28.0 || prop.lat > -18.0 || prop.lng < -63.0 || prop.lng > -53.0) {
        return false;
      }
    }
    return true;
  }

  // ===== PROPERTIES MANAGEMENT =====
  const propertiesRef = db.collection('properties');

  // Subscribe to properties in real-time
  let unsubscribeProps = null;
  window.subscribeProperties = function(callback) {
    if (unsubscribeProps) unsubscribeProps();

    // Helper to process and combine snapshot data with scraped properties
    const processAndEmit = (firestoreProps) => {
      const combined = [...firestoreProps, ...(window._localScrapedProperties || [])];
      // De-duplicate by ID (in case some scraped properties were also uploaded to Firestore)
      const seenIds = new Set();
      const uniqueCombined = [];
      combined.forEach(p => {
        p.type = window.normalizePropertyType(p.type);
        if (p.isScraped) {
          p.dataSource = 'radar';
        } else {
          p.dataSource = 'estimation';
        }
        if (!seenIds.has(p.id)) {
          seenIds.add(p.id);
          uniqueCombined.push(p);
        }
      });
      window.appData.properties = uniqueCombined;
      if (callback) callback(uniqueCombined);
    };

    // Load scraped properties first if not already loaded
    const loadScrapedPromise = window._localScrapedProperties 
      ? Promise.resolve(window._localScrapedProperties)
      : fetch('data/propiedades.json')
          .then(r => r.json())
          .then(data => {
            window._localScrapedProperties = data || [];
            return window._localScrapedProperties;
          })
          .catch(err => {
            console.error("Error loading scraped properties:", err);
            window._localScrapedProperties = [];
            return [];
          });

    loadScrapedPromise.then(() => {
      unsubscribeProps = propertiesRef.onSnapshot((snapshot) => {
        const firestoreProps = [];
        snapshot.forEach(doc => {
          const p = doc.data();
          if (isPropertyInParaguay(p)) {
            firestoreProps.push(p);
          }
        });
        firestoreProps.sort((a, b) => b.id - a.id);
        processAndEmit(firestoreProps);
      }, (error) => {
        console.error("Error subscribing to properties, using fallback/local:", error);
        processAndEmit([]);
      });
    });
  };

  // ===== MARKET NEWS MANAGEMENT =====
  const marketNewsRef = db.collection('market_news');
  let unsubscribeNews = null;
  
  window.subscribeMarketNews = function(callback) {
    if (unsubscribeNews) unsubscribeNews();
    unsubscribeNews = marketNewsRef.onSnapshot((snapshot) => {
      const news = [];
      snapshot.forEach(doc => news.push({ id: doc.id, ...doc.data() }));
      
      // Cache locally
      window.appData = window.appData || {};
      window.appData.marketNews = news;
      
      if (news.length === 0) {
        // Fallback to local JSON if DB is empty
        fetch('data/market-news.json').then(r => r.json()).then(data => {
          if (data && data.length) {
            window.appData.marketNews = data;
            if (callback) callback(data);
          } else if (callback) callback([]);
        }).catch(() => { if (callback) callback([]); });
      } else {
        if (callback) callback(news);
      }
    }, (error) => {
      console.error("Error subscribing to market news:", error);
      if (callback) callback([]);
    });
  };

  // Publish a new property
  window.publishProperty = async function(prop) {
    try {
      if (window.currentUserProfile) {
        prop.publisherType = window.currentUserProfile.userType || 'standard';
        prop.agentUid = window.currentUserProfile.uid;
      }
      await propertiesRef.doc(prop.id.toString()).set(prop);
      console.log("Property successfully published to Firestore.");
      // Trigger notifications check for other users who have active alerts
      triggerAlertsCheck(prop);
      return true;
    } catch (err) {
      console.error("Error publishing property:", err);
      throw err;
    }
  };

  // ===== CHATS & MESSAGING =====
  const chatsRef = db.collection('chats');

  // Get or Create Chat document
  window.getOrCreateChat = async function(buyerId, buyerName, ownerId, ownerName, propertyId, propertyTitle) {
    const chatId = `chat_${propertyId}_${buyerId}`;
    const chatDocRef = chatsRef.doc(chatId);
    
    const doc = await chatDocRef.get();
    if (!doc.exists) {
      // Get current userType (since buyer is the current user creating the chat)
      const buyerType = window.currentUserProfile ? window.currentUserProfile.userType : 'standard';
      
      // Let's try to get the ownerType from the property if possible, or leave standard
      const propDoc = await propertiesRef.doc(propertyId.toString()).get();
      const ownerType = propDoc.exists ? (propDoc.data().publisherType || 'standard') : 'standard';

      const chatData = {
        id: chatId,
        buyerId,
        buyerName,
        buyerType,
        ownerId,
        ownerName,
        ownerType,
        propertyId,
        propertyTitle,
        lastMsg: '',
        lastMsgTime: Date.now(),
        unreadBuyer: false,
        unreadOwner: false,
        participants: [buyerId, ownerId]
      };
      await chatDocRef.set(chatData);
    }
    return chatId;
  };

  // Subscribe to user chats list
  let unsubscribeChats = null;
  window.subscribeUserChats = function(userId, callback) {
    if (unsubscribeChats) unsubscribeChats();
    // Fetch chats where user is participant
    unsubscribeChats = chatsRef
      .where('participants', 'array-contains', userId)
      .onSnapshot((snapshot) => {
        const chats = [];
        snapshot.forEach(doc => {
          chats.push(doc.data());
        });
        // Sort client-side by last message time
        chats.sort((a, b) => b.lastMsgTime - a.lastMsgTime);
        if (callback) callback(chats);
      }, (error) => {
        console.error("Error subscribing to chats:", error);
      });
  };

  // Subscribe to messages in a chat
  let unsubscribeMessages = null;
  window.subscribeMessages = function(chatId, callback) {
    if (unsubscribeMessages) unsubscribeMessages();
    // Sin orderBy para evitar requerir un índice compuesto en Firebase.
    // Ordenamos localmente por timestamp ascendente.
    unsubscribeMessages = chatsRef.doc(chatId).collection('messages')
      .limit(200)
      .onSnapshot((snapshot) => {
        const messages = [];
        snapshot.forEach(doc => messages.push(doc.data()));
        messages.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
        if (callback) callback(messages);
      }, (error) => {
        console.error('Error subscribing to messages:', error);
      });
  };

  // Send message
  window.sendChatMessage = async function(chatId, senderId, text) {
    try {
      const msgId = Date.now().toString();
      const msgData = {
        id: msgId,
        senderId,
        text,
        timestamp: Date.now()
      };
      
      const chatDocRef = chatsRef.doc(chatId);
      const chatSnap = await chatDocRef.get();
      const chatData = chatSnap.data();
      
      const updateData = {
        lastMsg: text,
        lastMsgTime: Date.now()
      };
      
      if (senderId === chatData.buyerId) {
        updateData.unreadOwner = true;
      } else {
        updateData.unreadBuyer = true;
      }

      const batch = db.batch();
      batch.set(chatDocRef.collection('messages').doc(msgId), msgData);
      batch.update(chatDocRef, updateData);
      await batch.commit();
    } catch (err) {
      console.error("Error sending message:", err);
      throw err;
    }
  };

  // ===== ALERTS MANAGEMENT =====
  const alertsRef = db.collection('alerts');

  window.saveAlert = async function(alert) {
    try {
      // Siempre obtenemos el UID actual en el momento exacto del guardado
      const uid = firebase.auth().currentUser?.uid || currentUserId;
      if (!uid) throw new Error('Usuario no autenticado');
      alert.userId = uid;
      await alertsRef.doc(alert.id.toString()).set(alert);
      console.log('Alert saved to Firestore for user:', uid);
      return true;
    } catch (err) {
      console.error('Error saving alert:', err);
      throw err;
    }
  };

  window.deleteAlert = async function(alertId) {
    try {
      await alertsRef.doc(alertId.toString()).delete();
      console.log("Alert deleted from Firestore.");
      return true;
    } catch (err) {
      console.error("Error deleting alert:", err);
      throw err;
    }
  };

  window.toggleAlertActive = async function(alertId, activeState) {
    try {
      await alertsRef.doc(alertId.toString()).update({ active: activeState });
      console.log("Alert active status updated.");
      return true;
    } catch (err) {
      console.error("Error updating alert status:", err);
      throw err;
    }
  };

  let unsubscribeAlerts = null;
  window.subscribeUserAlerts = function(userId, callback) {
    if (unsubscribeAlerts) unsubscribeAlerts();
    unsubscribeAlerts = alertsRef
      .where('userId', '==', userId)
      .onSnapshot((snapshot) => {
        const alerts = [];
        snapshot.forEach(doc => {
          alerts.push(doc.data());
        });
        alerts.sort((a, b) => b.id - a.id);
        window._userAlerts = alerts;
        if (callback) callback(alerts);
      }, (error) => {
        console.error("Error subscribing to alerts:", error);
      });
  };

  // ===== NOTIFICATIONS MANAGEMENT =====
  const notificationsRef = db.collection('notifications');

  let unsubscribeNotifications = null;
  window.subscribeUserNotifications = function(userId, callback) {
    if (unsubscribeNotifications) unsubscribeNotifications();
    unsubscribeNotifications = notificationsRef
      .where('userId', '==', userId)
      .onSnapshot((snapshot) => {
        const notifs = [];
        snapshot.forEach(doc => {
          notifs.push(doc.data());
        });
        notifs.sort((a, b) => b.timestamp - a.timestamp); // newest first if timestamp is used, wait, we will use timestamp
        if (callback) callback(notifs);
      }, (error) => {
        console.error("Error subscribing to notifications:", error);
      });
  };

  window.markNotificationRead = async function(notifId) {
    try {
      await notificationsRef.doc(notifId).update({ unread: false });
    } catch (err) {
      console.error("Error marking notification read:", err);
    }
  };

  // Client-side Trigger to check alerts and generate notifications
  async function triggerAlertsCheck(newProp) {
    try {
      // Get all active alerts
      const snap = await alertsRef.where('active', '==', true).get();
      snap.forEach(async doc => {
        const alert = doc.data();
        
        // Skip alerting the publisher
        if (alert.userId === currentUserId) return;
        
        // Match conditions
        let match = true;
        
        // Match zone / barrio (case insensitive substring)
        if (alert.zone && !newProp.address.toLowerCase().includes(alert.zone.toLowerCase())) {
          match = false;
        }
        
        // Match property type
        if (alert.propType && newProp.type !== alert.propType) {
          match = false;
        }
        
        // Match operation (Venta/Alquiler)
        if (alert.op && newProp.op !== alert.op) {
          match = false;
        }
        
        // Match price limits
        const price = newProp.price;
        if (alert.pmin && price < parseFloat(alert.pmin)) match = false;
        if (alert.pmax && price > parseFloat(alert.pmax)) match = false;
        
        if (match) {
          // Alert matches! Create notification document in Firestore
          const notifId = `notif_${alert.id}_${Date.now()}`;
          const notifData = {
            id: notifId,
            userId: alert.userId,
            icon: alert.icon || '',
            text: `Nueva propiedad: ${newProp.title} en ${newProp.address} por US$ ${newProp.price.toLocaleString()}`,
            time: 'Recién',
            timestamp: Date.now(),
            unread: true
          };
          await notificationsRef.doc(notifId).set(notifData);
          console.log(`Notification sent to user ${alert.userId}`);
        }
      });
    } catch (err) {
      console.error("Error running alerts trigger check:", err);
    }
  }

  // Helper: Seed initial alerts and notifications for the user if they have none
  async function seedUserAlertsIfNeeded(userId) {
    const userAlertsSnap = await alertsRef.where('userId', '==', userId).get();
    if (userAlertsSnap.empty) {
      const defaultAlerts = [
        { id: 1, type: 'price_drop', icon: '', name: 'Dptos baratos en Asunción', zone: 'Asunción Centro', propType: 'Departamento', op: 'Venta', pmin: '', pmax: '120000', threshold: '5', freq: 'daily', active: true, userId },
        { id: 2, type: 'new_listing', icon: '', name: 'Casas en Luque', zone: 'Luque', propType: 'Casa', op: '', pmin: '', pmax: '200000', threshold: '1', freq: 'instant', active: true, userId },
      ];
      for (const alert of defaultAlerts) {
        await alertsRef.doc(alert.id.toString() + "_" + userId).set(alert);
      }
      
      // Default notifications
      const defaultNotifs = [
        { id: `notif_seed_1_${userId}`, userId, icon: '', text: 'Villa Morra subió 3.2% — nueva oportunidad detectada', time: 'Hace 5 min', timestamp: Date.now() - 5*60*1000, unread: true },
        { id: `notif_seed_2_${userId}`, userId, icon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style="color:#ff2a5f; display:inline-block;"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>', text: 'Tu propiedad guardada bajó de precio en Luque', time: 'Hace 1 hora', timestamp: Date.now() - 60*60*1000, unread: true },
        { id: `notif_seed_3_${userId}`, userId, icon: '', text: 'Valentina Rossi te envió un mensaje nuevo', time: 'Hace 2 horas', timestamp: Date.now() - 2*60*60*1000, unread: true },
      ];
      for (const notif of defaultNotifs) {
        await notificationsRef.doc(notif.id).set(notif);
      }
    }
  }

  // ===== FAVORITES PERSISTENCE =====
  const usersRef = db.collection('users');

  window.saveUserFavorites = async function(userId, favoritesArray) {
    try {
      await usersRef.doc(userId).set({ favorites: favoritesArray }, { merge: true });
      console.log("Favorites successfully saved to Firestore.");
      return true;
    } catch (err) {
      console.error("Error saving favorites:", err);
      throw err;
    }
  };

  let unsubscribeFavs = null;
  window.subscribeUserFavorites = function(userId, callback) {
    if (unsubscribeFavs) unsubscribeFavs();
    unsubscribeFavs = usersRef.doc(userId).onSnapshot((doc) => {
      let favs = [];
      if (doc.exists && doc.data().favorites) {
        favs = doc.data().favorites;
      } else {
        // Create user doc with empty favorites
        usersRef.doc(userId).set({ favorites: [] }, { merge: true });
      }
      window.appData.favorites = new Set(favs);
      if (callback) callback(favs);
    }, (error) => {
      console.error("Error subscribing to favorites:", error);
    });
  };

  // ===== INITIALIZE USER-SPECIFIC SYNC =====
  function initUserSync(user) {
    seedUserAlertsIfNeeded(user.uid).then(() => {
      // 1. Subscribe to User Alerts
      if (window.subscribeUserAlerts) {
        window.subscribeUserAlerts(user.uid, (alerts) => {
          if (window._renderAlerts) window._renderAlerts();
        });
      }
      
      // 2. Subscribe to User Notifications
      if (window.subscribeUserNotifications) {
        window.subscribeUserNotifications(user.uid, (notifs) => {
          if (window.updateNotificationsUI) window.updateNotificationsUI(notifs);
        });
      }

      // 3. Subscribe to User Chats List
      if (window.subscribeUserChats) {
        window.subscribeUserChats(user.uid, (chats) => {
          if (window.renderUserConversationsList) window.renderUserConversationsList(chats);
        });
      }

      // 4. Subscribe to User Favorites
      if (window.subscribeUserFavorites) {
        window.subscribeUserFavorites(user.uid, (favs) => {
          if (window.updateFavBadges) window.updateFavBadges();
          const viewFavs = document.getElementById('view-favorites');
          if (viewFavs && viewFavs.classList.contains('active') && window.renderFavorites) {
            window.renderFavorites();
          }
        });
      }
    });
  }

  // ===== GOOGLE SHEETS SYNCHRONIZATION =====
  window.syncPropertiesFromGoogleSheet = async function(sheetUrlOrId) {
    let sheetId = sheetUrlOrId.trim();
    if (sheetUrlOrId.includes('/d/')) {
      const match = sheetUrlOrId.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (match) sheetId = match[1];
    }
    
    // We will fetch as CSV using Google Sheets export link
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
    
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(window.t("sheets_error_download"));
      const csvText = await res.text();
      
      const rows = parseCSVString(csvText);
      if (rows.length === 0) throw new Error(window.t("sheets_error_empty"));
      
      const headers = rows[0].map(h => h.trim().toLowerCase());
      const properties = [];
      
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (row.length < headers.length || !row[0]) continue;
        
        const prop = {};
        headers.forEach((header, index) => {
          let val = row[index] ? row[index].trim() : '';
          
          if (['id', 'price', 'm2', 'rooms', 'baths', 'lat', 'lng', 'roi'].includes(header)) {
            prop[header] = Number(val) || 0;
          } else if (header === 'featured' || header === 'isown') {
            prop[header] = val.toLowerCase() === 'true';
          } else {
            prop[header] = val;
          }
        });
        
        if (prop.id) {
          prop.type = window.normalizePropertyType(prop.type);
          prop.priceM2 = prop.m2 > 0 ? Math.round(prop.price / prop.m2) : 0;
          if (isPropertyInParaguay(prop)) {
            properties.push(prop);
          } else {
            console.log(`Omitiendo propiedad de Sheets id=${prop.id} por estar fuera de Paraguay.`);
          }
        }
      }
      
      if (properties.length === 0) {
        throw new Error(window.t("sheets_error_no_id"));
      }
      
      const averagesObj = {};
      properties.forEach(p => {
        if (p.op === 'Venta' && p.m2 > 0) {
          const isPy = p.address.toLowerCase().includes('paraguay') || p.address.toLowerCase().includes('asuncion') || p.address.toLowerCase().includes('luque');
          const key = `${p.type}_${isPy ? 'PY' : 'AR'}`;
          if (!averagesObj[key]) averagesObj[key] = { total: 0, count: 0 };
          averagesObj[key].total += p.price / p.m2;
          averagesObj[key].count += 1;
        }
      });
      
      properties.forEach(p => {
        p.isUnderpriced = p.isUnderpriced || false;
        p.discount = p.discount || 0;
        if (p.op === 'Venta' && p.m2 > 0) {
          const isPy = p.address.toLowerCase().includes('paraguay') || p.address.toLowerCase().includes('asuncion') || p.address.toLowerCase().includes('luque');
          const key = `${p.type}_${isPy ? 'PY' : 'AR'}`;
          const avg = averagesObj[key];
          if (avg && avg.count > 0) {
            const avgM2 = avg.total / avg.count;
            const myM2 = p.price / p.m2;
            if (myM2 < avgM2 * 0.92) {
              p.isUnderpriced = true;
              p.discount = Math.round((1 - (myM2 / avgM2)) * 100);
            }
          }
        }
      });
      
      console.log(`Sincronizando ${properties.length} anuncios reales de Google Sheets a Firestore...`);
      
      const batch = db.batch();
      properties.forEach(p => {
        const docRef = propertiesRef.doc(p.id.toString());
        batch.set(docRef, p);
      });
      
      await batch.commit();
      console.log("¡Catálogo sincronizado exitosamente en Firestore!");
      return properties.length;
    } catch (err) {
      console.error("Error en sincronización con Sheets:", err);
      throw err;
    }
  };

  function parseCSVString(text) {
    const lines = [];
    let row = [""];
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      const next = text[i+1];

      if (c === '"') {
        if (inQuotes && next === '"') {
          row[row.length - 1] += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (c === ',' && !inQuotes) {
        row.push('');
      } else if ((c === '\r' || c === '\n') && !inQuotes) {
        if (c === '\r' && next === '\n') {
          i++;
        }
        lines.push(row);
        row = [''];
      } else {
        row[row.length - 1] += c;
      }
    }
    if (row.length > 1 || row[0] !== '') {
      lines.push(row);
    }
    return lines;
  }

  // ===== INITIALIZE APP SYNC ON LOAD =====
  // Immediately sync properties on load
  window.subscribeProperties((props) => {
    if (window.applyExploreFilters) {
      window.applyExploreFilters();
    } else if (window.renderFiltered) {
      window.renderFiltered(props);
    }
    if (window.mapInstance && window.filterMapMarkers) {
      window.filterMapMarkers(window._currentMapCriteria || {});
    }
  });

})();
