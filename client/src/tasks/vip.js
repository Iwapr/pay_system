/**
 * client/src/tasks/vip.js - 会员（VIP）API 调用封装
 *
 * 封装 VIP 会员的增删改查和积分管理接口。
 *
 * 方法列表：
 *  - frontQurey(ajax, query):              前台搜索会员       GET  /api/front/vip/:query
 *  - getAllVip(ajax):                      获取所有会员       GET  /api/vip/members
 *  - delVipMember(ajax, code):            删除会员           DELETE
 *  - disableVipMember(ajax, code):        禁用会员
 *  - enableVipMember(ajax, code):         启用会员
 *  - createVipMember(ajax, data):         创建会员           POST
 *  - updateVipMember(ajax, code, value):  更新会员信息       PUT
 *  - getVipPointRules(ajax):              获取积分规则       GET
 *  - updateVipPointRules(ajax, value):    更新积分规则       PUT
 *  - vipChangeCard(ajax, data):           换卡              POST
 *  - setVipPoint(ajax, code, point, type):手动设置积分       PUT
 */
export class VipManage {
    static frontQurey(ajax, query) {
        return ajax.get(`/api/front/vip/${encodeURIComponent(query)}`);
    }

    static getAllVip(ajax) {
        return ajax.get("/api/vip/members");
    }

    static delVipMember(ajax, code) {
        return ajax.delete(`/api/vip/members/delete/${encodeURIComponent(code)}`);
    }

    static disableVipMember(ajax, code) {
        return ajax.put("/api/vip/members/update", {
            code,
            update_value: {
                is_disable: true
            }
        });
    }

    static enableVipMember(ajax, code) {
        return ajax.put("/api/vip/members/update", {
            code,
            update_value: {
                is_disable: false
            }
        });
    }

    static createVipMember(ajax, data) {
        return ajax.post("/api/vip/members/create", data);
    }

    static updateVipMember(ajax, code, update_value) {
        return ajax.put("/api/vip/members/update", {
            code,
            update_value
        });
    }

    static getVipPointRules(ajax) {
        return ajax.get("/api/vip/members/pointrules");
    }

    static updateVipPointRules(ajax, value) {
        return ajax.put("/api/vip/members/pointrules", {
            value
        });
    }

    static vipChangeCard(ajax, data) {
        return ajax.post("/api/vip/members/change", data);
    }

    static setVipPoint(ajax, code, point, type) {
        return ajax.put("/api/vip/members/setpoint", {
            point,
            code,
            type: type === "add"
        });
    }
}