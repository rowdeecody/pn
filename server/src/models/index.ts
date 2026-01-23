import User, { UserAttributes, UserCreationAttributes } from './User';
import PC, { PcAttributes, PcCreationAttributes } from './PC';
import Session, { SessionAttributes, SessionCreationAttributes } from './Session';
import Transaction, { TransactionAttributes, TransactionCreationAttributes } from './Transaction';
import Setting, { SettingAttributes } from './Setting';
import defineAssociations from './associations';

// Initialize model associations. Call this once during app startup before using relations.
export function initModels(): void {
    defineAssociations();
}

export {
    User,
    PC,
    Session,
    Transaction,
    Setting,
    // attribute interfaces
    UserAttributes,
    UserCreationAttributes,
    PcAttributes,
    PcCreationAttributes,
    SessionAttributes,
    SessionCreationAttributes,
    TransactionAttributes,
    TransactionCreationAttributes,
    SettingAttributes,
};

export default {
    initModels,
    User,
    PC,
    Session,
    Transaction,
    Setting,
};
