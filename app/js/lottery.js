import 'babel-polyfill';
import $ from 'jquery';
import Calculate from './lottery/calculate.js';
import Base from './lottery/base.js';
import Interface from './lottery/interface.js';
import Timer from './lottery/timer.js';




const copyProperties = function (target, source) {
    for (let key of Reflect.ownKeys(source)) {
        if (key !== 'constructor' && key !== 'prototype' && key !== 'name') {
            let desc = Object.getOwnPropertyDescriptor(source, key);
            Object.defineProperty(target, key, desc);
        }
    }
}

const mix = function (...rest) {
    class Mix {}
    for (let item of rest) {
        copyProperties(Mix, item);
        copyProperties(Mix.prototype, item.prototype);
    }
    return Mix;
}

class Lottery extends mix(Base, Calculate, Interface, Timer) {
    constructor(name = 'syy', cname = '11选5', issue = '**', state = '**') { //name 彩种名称识别，cname 彩种名称， issue 当前期号， state 当前状态
        super();
        this.name = name; //对象属性
        this.cname = cname;
        this.issue = issue;
        this.state = state;

        this.omit = new Map(); //遗漏
        this.open_code = new Set(); //开奖号码
        this.open_code_list = new Set(); //开奖记录
        this.play_list = new Map(); //玩法列表
        this.number = new Set(); //选号

        this.el = ''; //当前选择器
        this.issue_el = '#curr_issue'; //当前选号的期号的选择器
        this.countdown_el = '#countdown'; //倒计时选择器
        this.state_el = '.state_el'; //状态选择器
        this.cart_el = '.codelist'; //购物车选择器
        this.omit_el = ''; //遗漏的选择器
        this.cur_play = 'r5'; //当前玩法

        this.initPlayList(); //初始化玩法
        this.initNumber(); //初始化期号
        this.updateState(); //更新状态
        this.initEvent(); //时间初始化

    }

    //updateState 状态更新
    updateState() {
        let self = this;
        this.getState().then(function (res) {
            self.issue = res.issue; //获取当前期号
            self.end_time = res.end_time; //获取最新的销售截止时间
            self.state = res.state; //获取当前状态
            $(self.issue_el).text(res.issue); //更新当前期号
            self.countdown(res.end_time, function (time) { //更新倒计时
                $(self.countdown_el).html(time)
            }, function () {
                setTimeout(function () {
                    self.updateState(); //重新获取最新的销售状态
                    self.getOmit(self.issue).then(function (res) { //获取当前最新的遗漏

                    });
                    self.getOpenCode(self.issue).then(function (res) { //更新开奖号码

                    });
                }, 500);
            });
        });
    }

    //ininEvent  初始化事件
    initEvent() {
        let self = this;
        $('#plays').on('click', 'li', self.changePlayNav.bind(self)); //玩法切换
        $('.boll-list').on('click', '.btn-boll', self.toggleCodeActive.bind(self)); //号码选中
        $('#confirm_sel_code').on('click', self.addCode.bind(self)); //添加号码
        $('.dxjo').on('click', 'li', self.assistHandle.bind(self)); //操作区（大 小 奇偶 清除）
        $('.qkmethod').on('click', '.btn-middle', self.getRandomCode.bind(self)); //随机选则中号码
    }
}

export default Lottery; //导出当前接口e