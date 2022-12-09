// the routers about account is difined here

import { Router } from 'express';
import { createServer } from 'http';
import express from 'express';
import { Server, Socket } from 'socket.io';

// import account controller
import * as acc_controller from '../controller/accountController';

const router = express.Router();

// login
router.post('/login', acc_controller.login);

// createAccount
router.post('/create', acc_controller.create_account);

// getUserById
router.get('/getUserById', acc_controller.get_account_by_id);

// alertUser
router.post('/alertUser', acc_controller.alert_user);

// changeUserAvator
router.post('/changeAvator', acc_controller.change_avator);

// get avator直接交给静态文件处理 就不写路由了
// 但是要对应的传递blob数据 不知道静态文件能不能处理blob数据
// router.get('/getAvator', acc_controller.get_avator);

// delete user
router.post('/deleteUser', acc_controller.delete_user);

module.exports = router;