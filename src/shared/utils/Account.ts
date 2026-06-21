import { AccountRegisterSchema } from "../../modules/account/account.types.js";

export function CheckElegiblityCriteria(data: AccountRegisterSchema) {
    if (data.category == "Saving" && data.balance < "2000") {
        return { message: "Minimum Amount should be 2000", status: 302, success: false }
    } else if (data.category == "Current" && data.balance < "10000") {
        return { message: "Minimum Amount should be 10000", status: 302, success: false }
    }
    return { success: true };
}