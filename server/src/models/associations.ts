import PC from './PC';
import Session from './Session';
import Transaction from './Transaction';

// Centralize model relationship definitions to avoid duplication and ordering issues.
export default function defineAssociations(): void {
    PC.hasMany(Session, { foreignKey: 'pc_id', as: 'sessions' });
    Session.belongsTo(PC, { foreignKey: 'pc_id', as: 'pc' });

    PC.hasMany(Transaction, { foreignKey: 'pc_id', as: 'transactions' });
    Transaction.belongsTo(PC, { foreignKey: 'pc_id', as: 'pc' });
}
