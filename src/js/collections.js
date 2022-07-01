import './imports';
import Header from '../components/Header';
import NewsList from '../components/NewsList';
import NoDataTip from '../components/NoDataTip';

;((doc) => {
    const oApp = doc.querySelector('#app');
    const followedList = JSON.parse(localStorage.getItem('followedList') || '[]');
    let oListWrapper= null;
    
    const init = () => {
        render();
        bindEvent();
    }

    function render() {
        const headerTpl = Header.tpl({
            url: '/',
            title: '我的收藏',
            showLeftIcon: true,
            showRightIcon: false
        })
        
        if(followedList.length > 0) {
            const wrapperTpl= NewsList.wrapperTpl(0.44);
            oApp.innerHTML += (headerTpl + wrapperTpl);
            oListWrapper = oApp.querySelector('.news-list');
            renderList(followedList);
        } else {
            oApp.innerHTML += (headerTpl + NoDataTip.tpl());
        }
    }

    function bindEvent() {
        followedList.length && NewsList.bindEvent(oListWrapper, setCurrentNews);
    }

    function renderList(data) {
        const followedListTpl = NewsList.tpl({data, pageNum: -1});
        oListWrapper.innerHTML += followedListTpl;
        NewsList.imgShow();
    }

    function setCurrentNews(options) {
        const { idx } = options;
        const currentNews = followedList[idx];
        localStorage.setItem('currentNews', JSON.stringify(currentNews));
    }

    init();
})(document)