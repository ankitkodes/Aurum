import { ValidationError } from "../../errors/validation/ValidationError.js";
export function CheckElegiblityCriteria(data) {
    if (data.category == "Saving" && Number(data.balance) < 2000) {
        throw new ValidationError("Minimum Amount for Saving account should be 2000");
    }
    else if (data.category == "Current" && Number(data.balance) < 10000) {
        throw new ValidationError("Minimum Amount for Current account should be 10000");
    }
}
