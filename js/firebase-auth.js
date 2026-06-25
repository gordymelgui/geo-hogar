/**
 * GeoHogar — Firebase Authentication
 */

(function() {
  // ===== SAFE STORAGE WRAPPER FOR PRIVATE BROWSING =====
  const safeStorage = window.safeStorage || {
    _fallback: {},
    getItem(key) {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        console.warn("localStorage.getItem failed, using fallback:", e);
        return this._fallback[key] || null;
      }
    },
    setItem(key, value) {
      try {
        localStorage.setItem(key, value);
      } catch (e) {
        console.warn("localStorage.setItem failed, using fallback:", e);
        this._fallback[key] = value;
      }
    }
  };
  window.safeStorage = safeStorage;

  // Initialize local profile if standard premium flag is set
  const localPremium = safeStorage.getItem('geohogar_local_premium') === 'true';
  if (localPremium && !window.currentUserProfile) {
    window.currentUserProfile = {
      uid: 'local_test_user',
      name: 'Usuario Test Local',
      email: 'test@geohogar.com',
      isPremium: true,
      favorites: []
    };
  }

  let auth = null;

  if (typeof firebase === 'undefined') {
    console.warn("Firebase SDK is not loaded. Operating in offline/local-fallback mode.");
    window.firebaseAuth = null;
    
    // Hide splash screen automatically in offline mode
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        if (splash) {
          splash.classList.add('fade-out');
          setTimeout(() => splash.remove(), 600);
        }
      }, 1000);
      
      // Update UI offline state
      if (window.updatePremiumUIState) {
        window.updatePremiumUIState();
      }
    });
    return;
  }

  const firebaseConfig = {
    apiKey: "YOUR_FIREBASE_KEY",
    authDomain: "geo-hogar-7985e.firebaseapp.com",
    projectId: "geo-hogar-7985e",
    storageBucket: "geo-hogar-7985e.firebasestorage.app",
    messagingSenderId: "387292800770",
    appId: "1:387292800770:web:e48ec44dad764c8af2c41b"
  };

  firebase.initializeApp(firebaseConfig);
  auth = firebase.auth();

  window.firebaseAuth = auth;

  let unsubscribeUserDoc = null;

  // ===== OBSERVADOR DE ESTADO =====
  auth.onAuthStateChanged((user) => {
    if (user) {
      document.getElementById('login-screen')?.classList.add('hidden');
      document.getElementById('app-shell')?.classList.remove('hidden');
      updateAppUser(user);

      // Suscribirse al perfil del usuario en Firestore en tiempo real
      const userRef = firebase.firestore().collection('users').doc(user.uid);
      if (unsubscribeUserDoc) unsubscribeUserDoc();
      
      unsubscribeUserDoc = userRef.onSnapshot((doc) => {
        let profile = null;
        if (doc.exists) {
          profile = doc.data();
          // Backward compatibility
          if (!profile.userType) {
            profile.userType = profile.isPremium ? 'premium' : 'standard';
          }
        } else {
          // Si no existe el documento, lo creamos con datos por defecto
          profile = {
            uid: user.uid,
            name: user.displayName || user.email.split('@')[0],
            email: user.email,
            isPremium: false,
            userType: 'standard', // 'standard', 'premium', 'broker'
            favorites: []
          };
          userRef.set(profile);
        }
        
        // Respect local test premium status if set
        const localPremium = safeStorage.getItem('geohogar_local_premium') === 'true';
        if (localPremium) {
          if (profile.userType === 'standard') profile.userType = 'premium';
        }

        // isPremium is a derived state from userType for backward compatibility
        profile.isPremium = (profile.userType === 'premium' || profile.userType === 'broker');

        window.currentUserProfile = profile;
        // Update UI
        if (window.updatePremiumUIState) {
          window.updatePremiumUIState();
        }
        // Ejecutar actualización de la UI si el módulo ui.js ya se cargó
        if (window.updatePremiumUIState) {
          window.updatePremiumUIState();
        }
      }, (error) => {
        console.error("Error al escuchar cambios del perfil:", error);
      });

      document.dispatchEvent(new CustomEvent('geohogar:auth:loggedin', { detail: { user } }));
    } else {
      if (unsubscribeUserDoc) {
        unsubscribeUserDoc();
        unsubscribeUserDoc = null;
      }
      window.currentUserProfile = null;
      document.getElementById('login-screen')?.classList.remove('hidden');
      document.getElementById('app-shell')?.classList.add('hidden');
    }

    // Ocultar Splash Screen con animación fluida
    setTimeout(() => {
      const splash = document.getElementById('splash-screen');
      if (splash) {
        splash.classList.add('fade-out');
        setTimeout(() => splash.remove(), 600); // Eliminar del DOM tras la animación
      }
    }, 1200);
  });

  function updateAppUser(user) {
    const name = user.displayName || user.email.split('@')[0];
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const photo = user.photoURL;

    const avatar = document.querySelector('.user-avatar');
    const userName = document.querySelector('.user-info .user-name');
    const profileAvatar = document.querySelector('.profile-avatar-lg');
    const profileName = document.querySelector('.profile-header h3');
    const profileEmail = document.querySelector('.profile-header p');

    if (avatar) {
      if (photo) {
        avatar.innerHTML = `<img src="${photo}" style="width:100%;height:100%;border-radius:50%;object-fit:cover">`;
      } else {
        avatar.textContent = initials;
      }
    }
    if (userName) userName.textContent = name.split(' ')[0] || window.t('default_user_name');
    if (profileAvatar) {
      if (photo) {
        profileAvatar.innerHTML = `<img src="${photo}" style="width:100%;height:100%;border-radius:50%;object-fit:cover">`;
      } else {
        profileAvatar.textContent = initials;
      }
    }
    if (profileName) profileName.textContent = name;
    if (profileEmail) profileEmail.textContent = user.email;

    const greetingEl = document.querySelector('#welcome-user-name');
    if (greetingEl) {
      greetingEl.textContent = name;
      greetingEl.removeAttribute('data-i18n');
    }
  }

  // ===== LOGIN =====
  window.doLogin = async function(email, password, rememberMe) {
    try {
      // Configurar persistencia según el checkbox del usuario
      const persistence = rememberMe ? firebase.auth.Auth.Persistence.LOCAL : firebase.auth.Auth.Persistence.SESSION;
      await auth.setPersistence(persistence);
      await auth.signInWithEmailAndPassword(email, password);
      return null;
    } catch (err) {
      return getAuthError(err.code);
    }
  };

  // ===== REGISTRO =====
  window.doRegister = async function(name, email, password) {
    try {
      const cred = await auth.createUserWithEmailAndPassword(email, password);
      await cred.user.updateProfile({ displayName: name });
      
      const profile = {
        uid: cred.user.uid,
        name: name,
        email: email,
        isPremium: false,
        favorites: []
      };
      await firebase.firestore().collection('users').doc(cred.user.uid).set(profile);
      
      updateAppUser(auth.currentUser);
      return null;
    } catch (err) {
      return getAuthError(err.code);
    }
  };

  // ===== GOOGLE SIGN IN =====
  window.doGoogleSignIn = async function() {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const cred = await auth.signInWithPopup(provider);
      
      const userRef = firebase.firestore().collection('users').doc(cred.user.uid);
      const doc = await userRef.get();
      if (!doc.exists) {
        const profile = {
          uid: cred.user.uid,
          name: cred.user.displayName || cred.user.email.split('@')[0],
          email: cred.user.email,
          isPremium: false,
          favorites: []
        };
        await userRef.set(profile);
      }
      return null;
    } catch (err) {
      console.error("Error en Google Sign-In:", err);
      return getAuthError(err.code);
    }
  };

  // ===== RECUPERAR CONTRASEÑA =====
  window.doResetPassword = async function(email) {
    try {
      await auth.sendPasswordResetEmail(email);
      return null;
    } catch (err) {
      return getAuthError(err.code);
    }
  };

  // ===== CERRAR SESIÓN =====
  window.doLogout = async function() {
    await auth.signOut();
  };

  // ===== TEST & EVENT BINDINGS FOR PREMIUM =====
  document.addEventListener('DOMContentLoaded', () => {
    // Simuladores de Premium eliminados para producción.
    // La asignación de cuentas Premium o Broker se realizará desde un backend o panel de admin real.
  });

  function getAuthError(code) {
    const errorKeys = {
      'auth/invalid-email': 'auth_invalid_email',
      'auth/user-not-found': 'auth_user_not_found',
      'auth/wrong-password': 'auth_wrong_password',
      'auth/email-already-in-use': 'auth_email_already_in_use',
      'auth/weak-password': 'auth_weak_password',
      'auth/too-many-requests': 'auth_too_many_requests',
      'auth/popup-closed-by-user': 'auth_popup_closed_by_user',
      'auth/invalid-credential': 'auth_invalid_credential',
    };
    const key = errorKeys[code];
    return key ? window.t(key) : window.t('auth_default_error');
  }
})();
