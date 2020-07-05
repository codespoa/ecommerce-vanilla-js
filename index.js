
import './app.scss';

(function() {
    "use strict";

    class ListProducts {
        constructor() {

            const prevButton = document.querySelector('#button-prev');
            const nextButton = document.querySelector('#button-next');
            const selectFilter = document.querySelector('#select-filter');            

            let currentPage = 1;
            const recordsPerPage = 20;
            let objJson = [];

            this.init = function () {

                document.querySelectorAll('.effect-menu').forEach(item => {
                    item.addEventListener('click', event => {
                        let menuMobile = document.querySelector('.menu-mobile');
                        if (menuMobile.classList.contains('active')) {
                            menuMobile.classList.remove('active');
                        } else menuMobile.classList.add('active');
                    });
                });

                selectFilter.addEventListener('change', function () {
                    let filterSelected = this.value;
                    switch (filterSelected) {
                        case 'nomeaz':
                            objJson.sort((a, b) => a.name.localeCompare(b.name));
                            break;
                        case 'nomeza':
                            objJson.sort((a, b) => b.name.localeCompare(a.name));
                            break;
                        case 'maiorpreco':
                            objJson.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
                            break;
                        case 'menorpreco':
                            objJson.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
                            break;
                        default:
                            break;
                    }
                    currentPage = 1;
                    changePage(1, objJson);
                });

                loadJSON(function (response) {
                    objJson = JSON.parse(response);

                    changePage(1, objJson);
                    pageNumbers();
                    selectedPage();
                    clickPage();
                    addEventListeners();
                });

            };

            function formatNumber (number) {
                let numberFormat = number;
                if (numberFormat.toString().indexOf('.') == -1) {
                    numberFormat = number + ',00';
                }
                return 'R$ ' + numberFormat.toLocaleString('pt-BR');
            }

            function loadJSON (callback) {
                // loadJson
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        try {
                            var data = JSON.parse(xhr.responseText);
                        }
                        catch (err) {
                            return;
                        }
                        const response = data.products;
                        objJson = [];
                        // add new value price formatted into array
                        for (let index = 0; index < response.length; index++) {
                            let elementData = response[index];
                            elementData.priceFormated = formatNumber(elementData.price);
                            objJson.push(elementData);
                        }
                        callback(JSON.stringify(objJson));
                    }
                };

                xhr.open("GET", "./src/config/mock-products.json", true);
                xhr.send();
            }

            let addEventListeners = function () {
                prevButton.addEventListener('click', prevPage);
                nextButton.addEventListener('click', nextPage);
            };

            let selectedPage = function () {
                let pageNumber = document.getElementById('page-number').getElementsByClassName('click-page-number');
                for (let i = 0; i < pageNumber.length; i++) {
                    if (i == currentPage - 1)
                        pageNumber[i].classList.add('active');
                    else
                        pageNumber[i].classList.remove('active');
                }
            };

            let checkButtonOpacity = function () {
                currentPage == 1 ? prevButton.classList.add('opacity') : prevButton.classList.remove('opacity');
                currentPage == numPages() ? nextButton.classList.add('opacity') : nextButton.classList.remove('opacity');
            };

            let changePage = function (page, objJson) {

                const listingTable = document.getElementById('products-html');

                if (page < 1) {
                    page = 1;
                }

                if (page > (numPages() - 1)) {
                    page = numPages();
                }

                listingTable.innerHTML = "";
                var html = '<ul>';
                for (let i = (page - 1) * recordsPerPage; i < (page * recordsPerPage) && i < objJson.length; i++) {
                    html += '<li>' +
                        '<img src="' + objJson[i].image + '" alt="src="' + objJson[i].name + '">' +
                        '<p>' + objJson[i].name + '</p>' +
                        '<span>' + objJson[i].priceFormated + '</span>' +
                        '</li>';
                }
                html += '</ul>';
                listingTable.innerHTML = html;
                checkButtonOpacity();
                selectedPage();
            };

            let prevPage = function () {
                if (currentPage > 1) {
                    currentPage--;
                    changePage(currentPage, objJson);
                }
            };

            let nextPage = function () {
                if (currentPage < numPages()) {
                    currentPage++;
                    changePage(currentPage, objJson);
                }
            };

            let clickPage = function () {
                document.addEventListener('click', function (e) {
                    if (e.target.nodeName == "SPAN" && e.target.classList.contains("click-page-number")) {
                        currentPage = e.target.textContent;
                        changePage(currentPage, objJson);
                    }
                });
            };

            let pageNumbers = function () {
                let pageNumber = document.querySelector('#page-number');
                pageNumber.innerHTML = "";

                for (let i = 1; i < numPages() + 1; i++) {
                    pageNumber.innerHTML += "<span class='button click-page-number'>" + i + "</span>";
                }
            };

            let numPages = function () {
                return Math.ceil(objJson.length / recordsPerPage);
            };
        }
    }

  let list = new ListProducts();
  list.init();

})();



//-> Setup Project
