import navTpl from './tpl/index.tpl';
import itemTpl from './tpl/item.tpl';
import './index.scss';
import { tplReplace } from "../../libs/utils";

export default {
    name: 'NavBar',
    curIdx: 0,
    tpl(data) {
        let itemList = '';
        data.map(({ type, title }, index) => {
            itemList += tplReplace(itemTpl, {
                isCurrent: !index ? 'current' : '',
                type,
                title
            })
        })
        return tplReplace(navTpl, {
            wrapperW: 0.6 * data.length,
            itemList
        })
    },
    bindEvent(setType) {
        const oNav = document.querySelector('.nav');
        const oItems = document.querySelectorAll('.item');

        oNav.addEventListener('click', this._setNav.bind(this, oItems, setType));
    },
    _setNav(items, setType) {
        const tar = arguments[2].target;
        const className = tar.className.trim();
        if(className === 'item') {
            const type = tar.dataset.type;
            setType(type);

            // 切换current类名
            items[this.curIdx].className = 'item';
            this.curIdx = [].indexOf.call(items, tar);
            items[this.curIdx].className += ' current';
        }
    }
}