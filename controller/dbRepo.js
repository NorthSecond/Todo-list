"use strict";
// the database repository class
// this class is responsible for all database operations
// it is a singleton class
// In this project, we use the mysql database(when developing, we will use the mariaDB database when releasing)
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
// database definition sentences
/*
CREATE TABLE `folder`  (
  `client_id` bigint UNSIGNED NOT NULL,
  `folder_id` int UNSIGNED NOT NULL,
  `folder_name` varchar(64) NOT NULL,
  `folder_description` varchar(255) NULL,
  PRIMARY KEY (`client_id`, `folder_id`)
);

CREATE TABLE `group`  (
  `group_id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `group_name` varchar(64) NOT NULL,
  `founder_id` bigint UNSIGNED NOT NULL,
  `created_time` datetime NOT NULL,
  `members_num` int UNSIGNED NOT NULL,
  PRIMARY KEY (`group_id`)
);

CREATE TABLE `group_member`  (
  `belongs_id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `group_id` bigint UNSIGNED NOT NULL,
  `client_id` bigint UNSIGNED NOT NULL,
  PRIMARY KEY (`belongs_id`)
);

CREATE TABLE `message`  (
  `message_id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `client_id` bigint UNSIGNED NOT NULL,
  `push_type` int NOT NULL DEFAULT 0,
  `push_time` datetime NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`message_id`)
);

CREATE TABLE `subtask`  (
  `task_id` bigint UNSIGNED NOT NULL,
  `subtask_id` int UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`task_id`, `subtask_id`)
);

CREATE TABLE `table_1`  ();

CREATE TABLE `task`  (
  `task_id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `register_id` bigint UNSIGNED NOT NULL,
  `create_time` datetime NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` tinyint(1) NOT NULL DEFAULT 0,
  `priorty` int NOT NULL DEFAULT 0,
  `deadline` datetime NULL,
  `group_beglong` bigint UNSIGNED NULL,
  `note` text NULL,
  `is_favor` tinyint(1) NOT NULL DEFAULT 0,
  `belongs_folder_id` bigint UNSIGNED NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`task_id`)
);

CREATE TABLE `user_info`  (
  `client_id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_name` varchar(32) NOT NULL,
  `passwd_hash` binary(256) NOT NULL,
  `avator_path` varchar(255) NOT NULL DEFAULT /static/default.png,
  `register_time` datetime NOT NULL,
  `intro` text NULL,
  PRIMARY KEY (`client_id`, `register_time`)
);

ALTER TABLE `folder` ADD CONSTRAINT `client_id` FOREIGN KEY (`client_id`) REFERENCES `user_info` (`client_id`);
ALTER TABLE `group` ADD CONSTRAINT `foundered_id` FOREIGN KEY (`founder_id`) REFERENCES `user_info` (`client_id`);
ALTER TABLE `group_member` ADD CONSTRAINT `group` FOREIGN KEY (`group_id`) REFERENCES `group` (`group_id`);
ALTER TABLE `group_member` ADD CONSTRAINT `client` FOREIGN KEY (`client_id`) REFERENCES `user_info` (`client_id`);
ALTER TABLE `message` ADD FOREIGN KEY (`client_id`) REFERENCES `user_info` (`client_id`);
ALTER TABLE `subtask` ADD CONSTRAINT `task_belong` FOREIGN KEY (`task_id`) REFERENCES `task` (`task_id`);
ALTER TABLE `task` ADD FOREIGN KEY (`register_id`) REFERENCES `user_info` (`client_id`);
ALTER TABLE `task` ADD FOREIGN KEY (`group_beglong`) REFERENCES `group` (`group_id`);
ALTER TABLE `task` ADD FOREIGN KEY (`belongs_folder_id`, `register_id`) REFERENCES `folder` (`client_id`, `folder_id`);
*/
// import the mysql module
const mysql_1 = __importDefault(require("mysql"));
// import the database configuration
const dbConfig_1 = require("../config/dbConfig");
var config = dbConfig_1.dbConfig.development;
// import the entity classes
const account_1 = require("../model/account");
const group_1 = require("../model/group");
const folder_1 = require("../model/folder");
// the database repository class
class DbRepo {
    // the constructor
    constructor() {
        // create a database connection
        this.connection = mysql_1.default.createConnection({
            host: config.host,
            user: config.user,
            port: config.port,
            password: config.password,
            database: config.database
        });
        // connect to the database
        this.connection.connect();
    }
    // get the database repository instance
    static getInstance() {
        if (!this.instance) {
            this.instance = new DbRepo();
        }
        return this.instance;
    }
    // create a database
    // 但是连接直接指定了数据库，所以这个方法不需要
    createDatabase() {
        // create a database
        this.connection.query('CREATE DATABASE IF NOT EXISTS ' + config.database, (err, result) => {
            if (err) {
                console.log(err);
            }
            console.log('Database created');
        });
    }
    // create a table
    // 数据库直接在navicat制定了，所以只作为启动时的备用
    createTable() {
        // TODO: create tables
    }
    //////////////////////////// Account ////////////////////////////
    // login
    login(user_name, passwd_hash) {
        // login
        this.connection.query('SELECT * FROM user_info WHERE user_name = \'' + mysql_1.default.escape(user_name) + '\' AND passwd_hash = \'' + mysql_1.default.escape(passwd_hash) + '\'', (err, result) => {
            if (err) {
                console.log(err);
                // return err;
                return null;
            }
            console.log(result);
            // return client_id
            return result.client_id;
        });
    }
    // create a user account
    createAccount(account) {
        var values = {
            client_id: account.client_id,
            user_name: account.user_name,
            passwd_hash: account.password_hash,
            register_time: account.register_time
        };
        var sql = 'INSERT INTO user_info (user_name, passwd_hash, register_time) VALUES (\'' + values.user_name + '\', \'' + values.passwd_hash + '\', \'' + values.register_time + '\')';
        this.connection.query(sql, (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log('Account created');
                // return client_id
                sql = 'SELECT client_id FROM user_info WHERE user_name = \'' + values.user_name + '\' AND passwd_hash = \'' + values.passwd_hash + '\'';
                this.connection.query(sql, (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    return result.client_id;
                });
            }
        });
        return 0;
    }
    // get user by id
    getUserById(client_id) {
        var sql = 'SELECT * FROM user_info WHERE client_id = ' + client_id;
        var res = new account_1.Account(0, '', '', '', new Date(), '');
        this.connection.query(sql, (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                res = new account_1.Account(result.client_id, result.user_name, result.passwd_hash, result.avatar_path, result.register_time, result.introduction);
                console.log(result);
            }
        });
        return res;
    }
    // alert user info(by client_id)
    alertUserInfo(acc_new) {
        var sql = 'UPDATE user_info SET user_name = \'' + acc_new.user_name + '\', passwd_hash = \'' + acc_new.password_hash + '\', avatar_path = \'' + acc_new.avatar_path + '\', introduction = \'' + acc_new.introduction + '\' WHERE client_id = ' + acc_new.client_id;
        this.connection.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                return false;
            }
            else {
                return true;
            }
        });
        return false;
    }
    // change user avatar
    changeAvatar(client_id, avatar_path) {
        var sql = 'UPDATE user_info SET avatar_path = \'' + avatar_path + '\' WHERE client_id = ' + client_id;
        this.connection.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                return false;
            }
            else {
                return true;
            }
        });
        return false;
    }
    // delete a user account
    deleteAccount(client_id) {
        var sql = 'DELETE FROM user_info WHERE client_id = ' + client_id;
        this.connection.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                return false;
            }
            else {
                return true;
            }
        });
        return false;
    }
    /**
     * check if the user name is already used
     * @param user_name user name.
     * @returns if the user name is already used or something wrong happened when checking , return true, else return false.
     */
    checkUserName(user_name) {
        var sql = 'SELECT * FROM user_info WHERE user_name = \'' + user_name + '\'';
        this.connection.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                return true;
            }
            else {
                if (result.length == 0) {
                    return false;
                }
                else {
                    return true;
                }
            }
        });
        return true;
    }
    //////////////////////////// Group ////////////////////////////
    // create a group
    createGroup(group) {
        var values = {
            group_name: group.group_name,
            group_description: group.group_description,
            group_creator: group.group_creator,
            group_create_time: group.group_create_time
        };
        var sql = 'INSERT INTO group_info (group_name, group_description, group_creator, group_create_time) VALUES (' + values.group_name + ', ' + values.group_description + ', ' + values.group_creator + ', ' + values.group_create_time + ')';
        this.connection.query(sql, (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log('Group created');
                // return group_id
                sql = 'SELECT group_id FROM group_info WHERE group_name = \'' + values.group_name + '\' AND group_creator = ' + values.group_creator;
                this.connection.query(sql, (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    return result.group_id;
                });
            }
        });
        return 0;
    }
    ;
    // get group by id
    getGroupById(group_id) {
        var sql = 'SELECT * FROM group_info WHERE group_id = ' + group_id;
        var res = new group_1.Group(0, '', '', new Date(), 0);
        this.connection.query(sql, (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                res = new group_1.Group(result.group_id, result.group_name, result.group_description, result.group_creator, result.group_create_time);
                console.log(result);
            }
        });
        return res;
    }
    // get members of a group
    getGroupMembers(group_id) {
        var sql = 'SELECT * FROM group_member WHERE group_id = ' + group_id;
        var res = [];
        this.connection.query(sql, (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                for (var i = 0; i < result.length; i++) {
                    res.push(this.getUserById(result[i].client_id));
                }
                console.log(result);
            }
        });
        return res;
    }
    // alert group info(by group_id)
    alertGroupInfo(group_new) {
        var sql = 'UPDATE group_info SET group_name = \'' + group_new.group_name + '\', group_description = \'' + group_new.group_description + '\' WHERE group_id = ' + group_new.group_id;
        this.connection.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                return false;
            }
            else {
                return true;
            }
        });
        return false;
    }
    // delete a group
    deleteGroup(group_id) {
        var sql = 'DELETE FROM group_info WHERE group_id = ' + group_id;
        this.connection.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                return false;
            }
            else {
                return true;
            }
        });
        return false;
    }
    //////////////////////////// Folder ////////////////////////////
    // get folders of a user
    getUserFolders(client_id) {
        var sql = 'SELECT * FROM folder_info WHERE client_id = ' + client_id;
        var res = [];
        this.connection.query(sql, (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                for (var i = 0; i < result.length; i++) {
                    res.push(new folder_1.Folder(result[i].folder_id, result[i].folder_name, result[i].folder_description, result[i].folder_creator));
                }
                console.log(result);
            }
        });
        return res;
    }
    // create a folder
    createFolder(folder) {
        var values = {
            client_id: folder.client_id,
            folder_id: folder.folder_id,
            folder_name: folder.folder_name,
            folder_description: folder.folder_description,
        };
        var sql = 'INSERT INTO folder_info (client_id, folder_name, folder_description) VALUES (' + values.client_id + ', ' + values.folder_name + ', ' + values.folder_description + ')';
        this.connection.query(sql, (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log('Folder created');
                // return folder_id
                sql = 'SELECT folder_id FROM folder_info WHERE folder_name = \'' + values.folder_name + '\' AND client_id = ' + values.client_id;
                this.connection.query(sql, (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    return result.folder_id;
                });
            }
        });
        return 0;
    }
    // alert folder info(by client_i and folder_id)
    alertFolderInfo(folder_new) {
        var sql = 'UPDATE folder_info SET folder_name = \'' + folder_new.folder_name + '\', folder_description = \'' + folder_new.folder_description + '\' WHERE folder_id = ' + folder_new.folder_id + ' AND client_id = ' + folder_new.client_id;
        this.connection.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                return false;
            }
            else {
                return true;
            }
        });
        return false;
    }
    // delete a folder
    deleteFolder(folder_id) {
        var sql = 'DELETE FROM folder_info WHERE folder_id = ' + folder_id;
        this.connection.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                return false;
            }
            else {
                return true;
            }
        });
        return false;
    }
}
exports.db = new DbRepo();
