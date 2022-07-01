import './imports';
import Header from '../components/Header';
import NewsFrame from '../components/Iframe';
import Follow from '../components/Follow';
import { getUrlQueryValue } from '../libs/utils';

;((doc) => {
    const oApp = doc.querySelector('#app');
    const currentNews = JSON.parse(localStorage.getItem('currentNews'));
    const followedList = JSON.parse(localStorage.getItem('followedList') || '[]');

    const init = () => {
        render();
        bindEvent();
    }

    function render() {
        const headerTpl = Header.tpl({
            url: getUrlQueryValue('path'),
            title: '新闻详情',
            showLeftIcon: true,
            showRightIcon: false
        })

        const newsFrameTpl = NewsFrame.tpl(currentNews.url);
        const followTpl = createFollow();
        oApp.innerHTML += (headerTpl + newsFrameTpl + followTpl);
    }

    function bindEvent() {
        Follow.bindEvent(doFollow);
    }

    function doFollow(isFollow) {
        let followedList = JSON.parse(localStorage.getItem('followedList') || '[]');
        if(isFollow) {
            followedList.push(currentNews);
        } else {
            followedList = followedList.filter(item => {
                return item.uniquekey !== currentNews.uniquekey;
            })
        }
        localStorage.setItem('followedList', JSON.stringify(followedList));
    }

    function createFollow() {
        const isExist = followedList.find(item => {
            return item.uniquekey === currentNews.uniquekey
        })

        return isExist ? Follow.follow() : Follow.unfollow();
    }
    
    init();
})(document)