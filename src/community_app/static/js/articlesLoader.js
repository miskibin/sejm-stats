class ArticlesLoader {
    constructor(container, spinner) {
        this.articlesContainer = container;
        this.spinner = spinner;
        this.counter = 0;
        this.nextPageUrl = `${window.location.origin}/api/articles/`;
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.size > 0) {
            this.nextPageUrl = `${this.nextPageUrl}?${urlParams}`;
        }

        this.loadNextPage = this.loadNextPage.bind(this);
    }

    async fetchData(url) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    async renderArticles(articles) {
        await articles.forEach((article) => {
            const articleElement = this.getArticleTemplate(article);
            this.articlesContainer.appendChild(articleElement);
        });
    }


    getArticleTemplate(article) {
        let el = document.createElement('div');
        if (this.counter === 0) {
            el.classList.add('col-md-6', 'col-lg-5', 'col-xl-8', 'mb-4');
        }
        else {
            el.classList.add('col-md-6', 'col-lg-5', 'col-xl-4', 'mb-4');
        }
        this.counter = (this.counter + 1) % 3;
        el.innerHTML = `
            <div class="bg-image rounded-6">
                <img class="w-100" src="${article.image_url}" style="object-fit: cover; height: 421px" alt="" />
                <div class="mask"
                    style="background: linear-gradient(to bottom, hsla(0, 0%, 0%, 0), hsla(0, 0%, 0%, 0.6));">
                    <a href="${article.url}">
                        <div class="bottom-0 d-flex align-items-end h-100 p-4 text-white  hover-shadow">
                            <div>
                                <div class="d-flex flex-row small">
                                    <p class="text-uppercase"><p href="#!" class="text-reset">${article.category}</p>
                                    </p>
                                    <p class="mx-2">•</p>
                                    <p>${article.created_at}</p>
                                </div>
                                <h5 class="fw-bold pb-1">${article.title}</h5>
                                <p class="small mb-0">Autor: <p href="#!" class="text-reset">${article.author}</p></p>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        `;
        return el;
    }
    // getArticleTemplate(article) {
    //     let el = document.createElement('div');
    //     el.classList.add('row');
    //     el.classList.add('mb-md-4');
    //     el.innerHTML = `
    //         <div class="col-md-4 mb-4">
    //             <div class="bg-image hover-overlay shadow-1-strong rounded-5"
    //                  data-mdb-ripple-init data-mdb-ripple-color="light">
    //                 <img src="${article.image_url}" class="img-fluid"
    //                      style="object-fit: cover;height: 200px; width:100%;" alt=""/>
    //                 <a href="${article.url}" class="stretched-link">
    //                     <div class="mask" style="background-color: rgba(251, 251, 251, 0.15)"></div>
    //                 </a>
    //             </div>
    //         </div>

    //         <div class="col-md-8 mb-4 d-flex flex-column justify-content-between">
    //             <div class="article-short-description">
    //                 <h5><a href="${article.url}">${article.title}</a></h5>
    //                 <p class="d-block w-100 overflow-hidden">${article.truncated_text}</p>
    //             </div>
    //             <a href="${article.url}" class="btn btn-primary btn-rounded align-self-start"
    //                data-mdb-ripple-init>Czytaj</a>
    //         </div>
    //     `;
    //     return el;
    // }

    async loadNextPage(timeout = 300) {
        window.removeEventListener('completed.mdb.infiniteScroll', this.loadNextPage);
        try {
            this.spinner.style.display = 'flex';

            const data = await this.fetchData(this.nextPageUrl);
            const articles = data.results;
            this.nextPageUrl = data.next;

            setTimeout(async () => {
                if (articles != null) {
                    await this.renderArticles(articles);
                }
                this.spinner.style.display = 'none';
            }, timeout); // at least time to show spinner before rendering articles
            if (this.nextPageUrl != null) {
                window.addEventListener('completed.mdb.infiniteScroll', this.loadNextPage);
            }
        } catch (error) {
            console.error('Error loading next page:', error);
            this.spinner.style.display = 'none';
        }
    }

    async init() {
        try {
            window.addEventListener('completed.mdb.infiniteScroll', this.loadNextPage);
            await this.loadNextPage(0);
            new mdb.InfiniteScroll(window);
        } catch (error) {
            console.error('Error initializing:', error);
        }
    }
}

const container = document.getElementById('articles');
const spinner = document.getElementById('spinner');
const articleLoader = new ArticlesLoader(container, spinner);
articleLoader.init();
