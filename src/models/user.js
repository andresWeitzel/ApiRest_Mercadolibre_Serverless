

const { DataTypes } = require('sequelize');
const db = require('../db/localConfig');
const sequelize = db.localConnection;

const User = sequelize.define("user", {
    id: {
        type: DataTypes.INTEGER
        , allowNull: false
        , primaryKey: true
    },
    nickname: {
        type: DataTypes.STRING
        , allowNull: false
    },
    first_name: {
        type: DataTypes.STRING
        , allowNull: false
    },
    last_name: {
        type: DataTypes.STRING
        , allowNull: false
    },
    email: {
        type: DataTypes.STRING
        , allowNull: false
    },
    identification_type: {
        type: DataTypes.STRING
        , allowNull: false
    },
    identification_number: {
        type: DataTypes.STRING
        , allowNull: false
    },
    country_id: {
        type: DataTypes.STRING
        , allowNull: false
    },
    creation_date: {
        type: DataTypes.DATE
        , allowNull: false
    },
    update_date: {
        type: DataTypes.DATE
        , allowNull: false
    }
},
    {
        timestamps: false
    });



module.exports = { User }

