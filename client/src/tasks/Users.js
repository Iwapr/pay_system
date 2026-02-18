/**
 * client/src/tasks/Users.js - 用户管理 API 调用封装
 *
 * 封装后台用户管理接口。
 *
 * 方法列表：
 *  - changePwd(http, args):                    修改当前用户密码（带异常处理）POST /api/users/updatepwd
 *  - getAllUser(ajax):                          获取所有用户列表             GET /api/users
 *  - createUser(ajax, username, pwd, group):    创建新用户                  POST /api/users/createuser
 *  - changeUsername(ajax, old, new):            修改用户名                  POST /api/users/updateusername
 *  - changeUserPwd(ajax, username, pwd):        管理员重置用户密码           PUT  /api/users/updatepwd
 *  - changeUserGroup(ajax, username, group):    修改用户组                  PUT  /api/users/updateusergroup
 *  - changeUserStatus(ajax, username, status):  启用/禁用用户               PUT  /api/users/updateuserstatus
 */
class Users {
    static async changePwd(http, args) {
        // 修改用户密码
        try {
            const { data, status } = await http.post("/api/users/updatepwd", args);
            return {
                status: status === 200 ? true : false,
                message: data.message
            }
        } catch (err) {
            const { data } = err;
            return {
                status: false,
                message: data.message
            }
        }
    }

    static getAllUser(ajax) {
        return ajax.get("/api/users");
    }

    static createUser(ajax, new_username, password, group) {
        return ajax.post("/api/users/createuser", {
            new_username,
            password,
            group
        });
    }

    static changeUsername(ajax, old_username, new_username) {
        return ajax.post("/api/users/updateusername", {
            old_username,
            new_username
        });
    }

    static changeUserPwd(ajax, username, new_password) {
        return ajax.put("/api/users/updatepwd", {
            username,
            new_password
        });
    }

    static changeUserGroup(ajax, username, new_group) {
        return ajax.put("/api/users/updateusergroup", {
            username,
            new_group
        });
    }

    static changeUserStatus(ajax, username, status) {
        return ajax.put("/api/users/updateuserstatus", {
            username,
            status
        });
    }
}

export default Users;
export {
    Users
};