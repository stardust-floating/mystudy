import './imports';
import Header from '../components/Header';
import NavBar from '../components/NavBar';
import NewsList from '../components/NewsList';
import PageLoading from '../components/PageLoading';
import MoreLoading from '../components/MoreLoading';
import ErrorTip from '../components/ErrorTip';
import { NEWS_TYPE } from '../data';
import service from "../services/index";
import { scrollToBottom } from '../libs/utils';

; ((doc) => {
    const oApp = doc.querySelector('#app');
    const config = {
        type: 'top',
        count: 10,
        pageNum: 0,
        isLoading: false
    }
    const newsData = {};
    let oListWrapper = null;
    let t = null;
    const init = async () => {
        render();
        await setNewsList();
        bindEvent();
    }
    function bindEvent() {
        NavBar.bindEvent(setType);
        NewsList.bindEvent(oListWrapper, setCurrentNews);
        window.addEventListener('scroll', scrollToBottom.bind(null, getMoreList));
    }

    function setType(type) {
        config.type = type;
        // console.log(config.type);
        config.pageNum = 0;
        config.isLoading = false;
        oListWrapper.innerHTML = '';
        setNewsList();
    }

    async function setNewsList() {
        const { type, count, pageNum } = config;
        
        if(newsData[type]) {
            renderList(newsData[type][pageNum]);
            return;
        }

        oListWrapper.innerHTML = PageLoading.tpl();
        try {
           newsData[type] = await service.getNewsList(type, count);
        } catch (error) {
            if(error == 404) {
                oListWrapper.innerHTML = ErrorTip.tpl({
                    text: 'no web'
                });
                return;
            }
        }

        setTimeout(function() {
            oListWrapper.innerHTML = '';
            renderList(newsData[type][pageNum]);
        }, 1500)
    }

    function render() {
        const headerTpl = Header.tpl({
            url: '/',
            title: '新闻头条',
            showLeftIcon: false,
            showRightIcon: true
        })

        const navBarTpl = NavBar.tpl(NEWS_TYPE);
        const NewsListWrapperTpl = NewsList.wrapperTpl(0.82);

        oApp.innerHTML += (headerTpl + navBarTpl + NewsListWrapperTpl);
        oListWrapper = document.querySelector('.news-list');
    }

    function renderList(data) {
        const { pageNum } = config;
        const newsListTpl = NewsList.tpl({
            data,
            pageNum
        })
        MoreLoading.remove(oListWrapper);
        
        oListWrapper.innerHTML += newsListTpl;
        config.isLoading = false;
        NewsList.imgShow();
    }

    function getMoreList() {
        if(!config.isLoading) {
            config.pageNum++;
            clearTimeout(t);
            const { pageNum, type } = config;
            if(pageNum >= newsData[type].length) {
                MoreLoading.add(oListWrapper, false);
            } else {
                config.isLoading = true;
                MoreLoading.add(oListWrapper, true);
                t = setTimeout(() => {
                    // 加载数据
                    setNewsList();
                }, 1000);
            }
        }
    }

    function setCurrentNews(options) {
        const { idx, pageNum } = options;
        const currentNews = newsData[config.type][pageNum][idx];

        localStorage.setItem('currentNews', JSON.stringify(currentNews));
    }

    init();
})(document)
