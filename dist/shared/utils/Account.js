export function CheckElegiblityCriteria(data) {
    if (data.category == "Saving" && Number(data.balance) < 2000) {
        return { message: "Minimum Amount for Saving account should be 2000", status: 302, success: false };
    }
    else if (data.category == "Current" && Number(data.balance) < 10000) {
        return { message: "Minimum Amount for Current account should be 10000", status: 302, success: false };
    }
    return { message: "eliglbe to create account", status: 200, success: true };
}
