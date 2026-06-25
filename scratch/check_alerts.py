with open("c:\\Users\\jordy\\Desktop\\app hipo\\js\\broker-alerts.js", "r", encoding="utf-8") as f:
    for i, line in enumerate(f, 1):
        if "getZoneAvgPriceM2" in line or "checkPropAgainstBrokerAlerts" in line:
            print(f"{i}: {line.strip()}")
