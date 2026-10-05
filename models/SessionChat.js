const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const SessionChat = sequelize.define('SessionChat', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        session_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        sender_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        sender_role: {
            type: DataTypes.STRING,
            allowNull: false
        },
        message_text: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        }
    }, {
        tableName: 'session_chats',
        timestamps: false // Usamos created_at manual para la retención estricta
    });

    return SessionChat;
};