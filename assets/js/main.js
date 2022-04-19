window.onload = () => {
	fetchData("navLinks", createNavBar);
	fetchData("categories");
	fetchData("brands");
	fetchData("connectionTypes");
	fetchData("quotes");
	fetchData("navLinks", createFooterNavLinks);
	fetchData("socialLinks", createFooterSocialLinks);
	fetchData("documentLinks", createFooterDocumentLinks);

	function fetchData(fileName, callBack) {
		fetch(`./assets/data/${fileName}.json`)
			.then((response1) => response1.json())
			.then((response2) => {
				if (callBack != null) {
					callBack(response2);
				}
				return response2;
			})
			.then((response3) => {
				localStorage.setItem(`${fileName}Local`, JSON.stringify(response3));
				return response3;
			})
			.then((response4) => {
				return response4;
			});
	}

	function createNavBar(data) {
		navLinks("nav-warpper", data);
		navLinkShop("navbar-container");
		eventListener("shopping-card", "id", "click", openCard);
		eventListener("card-close", "id", "click", closeCard);
		createFooter();
	}

	function navLinkShop(ulID) {
		let ulTag = document.getElementById(`${ulID}`);
		let liTag = document.createElement("li");
		let iTag = document.createElement("i");
		iTag.setAttribute("class", "fa-solid fa-basket-shopping");
		iTag.setAttribute("id", "shopping-card");
		liTag.appendChild(iTag);
		let pTag = document.createElement("span");
		pTag.setAttribute("id", "incard-product-number");
		liTag.appendChild(pTag);
		ulTag.appendChild(liTag);
		inCardCount();
	}

	function navLinks(id, navLinksLocal) {
		let container = document.getElementById(`${id}`);
		let ulTag = document.createElement("ul");
		ulTag.setAttribute("id", "navbar-container");
		ulTag.setAttribute("class", "navbar-list");
		for (let link of navLinksLocal) {
			let liTag = document.createElement("li");
			let aTag = document.createElement("a");
			let aTagContent = document.createTextNode(`${link.name}`);
			aTag.append(aTagContent);
			aTag.setAttribute("href", `${link.link}`);
			liTag.appendChild(aTag);
			ulTag.appendChild(liTag);
		}
		container.appendChild(ulTag);
	}

	function brandsFilter(productsArray) {
		let selectedBrands = [];
		let brandsElements = document.querySelectorAll(".brands-filter-item:checked");
		for (let element of brandsElements) {
			selectedBrands.push(parseInt(element.value));
		}
		if (selectedBrands.length != 0) {
			return productsArray.filter(function (el) {
				for (let item of selectedBrands) {
					if (el.brandID == item) {
						return el;
					}
				}
			});
		}
		return productsArray;
	}

	function categoryFilter(productsArray) {
		let selectedCategory = [];
		let categoryElements = document.querySelectorAll(".category-filter-item:checked");
		for (let element of categoryElements) {
			selectedCategory.push(parseInt(element.value));
		}
		if (selectedCategory.length != 0) {
			return productsArray.filter(function (el) {
				for (let item of selectedCategory) {
					if (el.brandID == item) {
						return el;
					}
				}
			});
		}
		return productsArray;
	}

	function connectionTypeFilter(productsArray) {
		let connectionTypes = [];
		let connectionTypeElement = document.querySelectorAll(".connection-type-filter-item:checked");
		for (let element of connectionTypeElement) {
			connectionTypes.push(parseInt(element.value));
		}
		if (connectionTypes.length != 0) {
			return productsArray.filter(function (el) {
				for (let item of connectionTypes) {
					if (el.connectionTypeID == item) {
						return el;
					}
				}
			});
		}
		return productsArray;
	}

	function showProducts(productsArray) {
		productsArray = brandsFilter(productsArray);
		productsArray = categoryFilter(productsArray);
		productsArray = connectionTypeFilter(productsArray);
		productsArray = reviewsFilter(productsArray);
		let html = "";
		let container = document.getElementById("products");
		if (productsArray.length != 0) {
			for (let product of productsArray) {
				html += `<div class="product">
	              <img src="${product.image.src}" alt="${product.image.alt}" />
	              <p class="product-category-name">${categoryName(product.categoryID)}</p>
	              <p class="product-brandname">${showBrand(product.brandID)}</p>
	              <p class="product-name">${product.name}</p>
	              <p class="product-description">${product.descript}</p>
	              <p class="product-reviews">Reviews: ${product.score}<i class="fa-solid fa-star"></i></p>
	              <div class="product-price">
	                <p>Price:</p>
	                <s class="product-price-old">${product.price.discount != 0 ? product.price.old + "$" : ""}</s>
	                <p class="product-price-new">${priceCalculator(product.price.old, product.price.discount)}$</p>
	              </div>
	              <input class="product-add-to-card-btn" type="button" data-id="${product.id}" value="Add to card" />
	            </div>`;
			}
		} else {
			html += `<div id="product-message">
	                <h2>There is no products with selected criteria!</h2>
	              </div>`;
		}
		container.innerHTML = html;
		inCardProductsShow();
		let scoreP = document.getElementById("reviews-range-place");
		if (scoreP != null) {
			let rangeSlider = document.getElementById("reviews-range-sllider");
			scoreP.innerHTML = rangeSlider.value / 10;
		}
		eventListener("product-add-to-card-btn", "class", "click", addToCard);
	}
	function categoryName(productCategoryID) {
		let categoriesArray = jsonParse("categoriesLocal");
		let categoryName = categoriesArray.filter(function (el) {
			return el.id == productCategoryID;
		});
		return categoryName[0].name;
	}
	function priceCalculator(productPrice, productDiscount) {
		let price = productPrice * ((100 - productDiscount) / 100);
		return price.toFixed(2);
	}
	function showBrand(brandID) {
		let html = "";
		let brandsArray = jsonParse("brandsLocal");
		for (let brand of brandsArray) {
			if (brand.id == brandID) {
				html += `${brand.name}`;
			}
		}
		return html;
	}

	function filterProducts() {
		let productsArray = jsonParse("productsLocal");
		showProducts(productsArray);
	}
	// Make side filters
	function showFiltersBrand(data) {
		showProductsFilter("Brands", "brands-filter", data, "brands-filter-item");
	}
	function showFiltersCategory(data) {
		showProductsFilter("Category", "category-filter", data, "category-filter-item");
	}
	function showFiltersConnectionType(data) {
		showProductsFilter("Connection", "connection-type-filter", data, "connection-type-filter-item");
	}

	function showProductsFilter(filterName, containerName, arrayName, className) {
		let html = "";
		html += `<p>${filterName}</p>
	            <ul>`;
		let container = document.getElementById(containerName);
		for (let item of arrayName) {
			html += `<li>
	                  <input type="checkbox" name="${item.name}" class="${className}" value="${item.id}" id="${item.name}">
	                  <label for="${item.name}">${item.name} </label>
	                </li>`;
		}
		html += `</ul>`;
		container.innerHTML = html;
		eventListener(className, "class", "change", filterProducts);
	}

	// Show Reviews side filter

	function showReviews() {
		let container = document.getElementById("reviews-filter");
		let html = `<p>Reviews</p>
	        <div class="slidecontainer">
	          <input type="range" min="10" max="50" value="1" class="slider reviews-filter-item" id="reviews-range-sllider" />
	          <p id="reviews-range-place"></p>
	        </div>`;
		container.innerHTML = html;
		let score = document.getElementById("reviews-range-sllider");
		let scoreP = document.getElementById("reviews-range-place");
		scoreP.innerHTML = "1";
		score.addEventListener("click", filterProducts);
	}
	// Filter products per reviews
	function reviewsFilter(productsArray) {
		let scoreContainer = document.getElementById("reviews-range-sllider");
		let score;
		if (scoreContainer == null) {
			score = 1;
		} else {
			score = scoreContainer.value / 10;
		}
		return productsArray.filter(function (el) {
			if (el.score >= score) {
				return el;
			}
		});
	}

	function createFooter() {
		let footerId = document.getElementById("footer");
		let footerWrapper = document.createElement("div");
		footerWrapper.setAttribute("class", "wrapper");
		let footerTop = document.createElement("div");
		let navLinksLocal = jsonParse("navLinksLocal");
		footerTop.setAttribute("id", "footer-top");
		let footerBottom = document.createElement("div");
		let footerCopyright = document.createElement("p");
		let footerCopyrightContent = document.createTextNode("© Copyright 2022");
		footerCopyright.appendChild(footerCopyrightContent);
		footerBottom.appendChild(footerCopyright);
		footerBottom.setAttribute("id", "footer-bottom");
		footerWrapper.appendChild(footerTop);
		footerWrapper.appendChild(footerBottom);
		footerId.appendChild(footerWrapper);
	}

	function createFooterNavLinks(data) {
		let footerTop = document.getElementById("footer-top");
		createUlLinks(data, footerTop, "footerNav", "Navigation");
		aboutMePage();
	}
	function createFooterSocialLinks(data) {
		let footerTop = document.getElementById("footer-top");
		createUlLinks(data, footerTop, "footerSocial", "Social");
	}
	function createFooterDocumentLinks(data) {
		let footerTop = document.getElementById("footer-top");
		createUlLinks(data, footerTop, "footerDocument", "Links");
	}

	function createUlLinks(dataArray, mainContainer, divId, pContent) {
		let divContainer = document.createElement("div");
		divContainer.setAttribute("id", `${divId}`);
		let pContaier = document.createElement("p");
		let pContaierContent = document.createTextNode(`${pContent}`);
		pContaier.appendChild(pContaierContent);
		divContainer.appendChild(pContaier);
		let containerUl = document.createElement("ul");
		divContainer.appendChild(containerUl);
		for (let link of dataArray) {
			let navLinksLi = document.createElement("li");
			let navLinksA = document.createElement("a");
			let navLinksAContent = document.createTextNode(`${link.name}`);
			navLinksA.setAttribute("href", `${link.link}`);
			navLinksA.appendChild(navLinksAContent);
			navLinksLi.appendChild(navLinksA);
			containerUl.appendChild(navLinksLi);
		}
		mainContainer.appendChild(divContainer);
	}

	function eventListener(name, tagType, eventMethod, functionName) {
		if (tagType == "id") {
			let item = document.querySelector(`#${name}`);
			item.addEventListener(`${eventMethod}`, functionName);
		} else {
			let items = document.querySelectorAll(`.${name}`);
			for (let item of items) {
				item.addEventListener(`${eventMethod}`, functionName);
			}
		}
	}

	function addToCard() {
		let dataID = this.getAttribute("data-id");
		if (localStorage.getItem("addToCardList")) {
			let addToCardList = jsonParse("addToCardList");
			if (addToCardList.filter((e) => e.id == dataID).length) {
				cardMessages("Product already in card!");
			} else {
				addToCardList.push({
					id: dataID,
					quantity: 1,
				});
				cardMessages("Product added to card!");
				localStorage.setItem("addToCardList", JSON.stringify(addToCardList));
			}
		} else {
			let jsonTe = [];
			jsonTe[0] = {
				id: dataID,
				quantity: 1,
			};
			localStorage.setItem("addToCardList", JSON.stringify(jsonTe));
			cardMessages("Product added to card!");
		}
		inCardCount();
		inCardProductsShow();
		classGe();
	}

	// Test shopping-card-container
	function openCard() {
		let shoppingCardContainer = document.querySelector(".shopping-card-container");
		shoppingCardContainer.classList.add("shopping-card-active");
	}
	function closeCard() {
		let shoppingCardContainer = document.querySelector(".shopping-card-container");
		shoppingCardContainer.classList.remove("shopping-card-active");
	}

	// Add to card
	const addToCardBtnsList = document.querySelectorAll(".product-add-to-card-btn");
	for (let addToCardBtn of addToCardBtnsList) {
		addToCardBtn.addEventListener("click", function () {
			let dataID = this.getAttribute("data-id");
			if (localStorage.getItem("addToCardList")) {
				let addToCardList = jsonParse("addToCardList");
				if (addToCardList.filter((e) => e.id == dataID).length) {
					cardMessages("Product already in card!");
				} else {
					addToCardList.push({
						id: dataID,
						quantity: 1,
					});
					cardMessages("Product added to card!");
					localStorage.setItem("addToCardList", JSON.stringify(addToCardList));
				}
			} else {
				let jsonTe = [];
				jsonTe[0] = {
					id: dataID,
					quantity: 1,
				};
				localStorage.setItem("addToCardList", JSON.stringify(jsonTe));
			}
			inCardCount();
			inCardProductsShow();
		});
	}

	// Add to card message
	function cardMessages(text) {
		let messageDivTest = document.querySelector(".message");
		if (messageDivTest) {
			messageDivTest.parentNode.removeChild(messageDivTest);
		}
		let messageDiv = document.createElement("div");
		messageDiv.setAttribute("class", "message");
		let pTag = document.createElement("p");
		let pTagContent = document.createTextNode(`${text}`);
		pTag.appendChild(pTagContent);
		messageDiv.appendChild(pTag);
		let bodyTag = document.getElementsByTagName("body");
		bodyTag[0].appendChild(messageDiv);
		var clearElement = setInterval(() => {
			if (messageDiv.parentElement == null) {
				clearInterval(clearElement);
			} else {
				messageDiv.parentElement.removeChild(messageDiv);
			}
		}, 5000);
	}

	// In card counter
	function inCardCount() {
		let pTag = document.getElementById("incard-product-number");
		if (localStorage.getItem("addToCardList")) {
			let cardCounts = jsonParse("addToCardList").length;
			pTag.innerHTML = ` (${cardCounts})`;
		} else {
			pTag.innerHTML = " (0)";
		}
	}
	// InCardProducts
	function inCardProductsShow() {
		let addToCardList = jsonParse("addToCardList");
		let container = document.getElementById("card-products");
		let checkoutContainer = document.getElementById("checkout-product-list");
		container.innerHTML = "";
		if (addToCardList != null) {
			for (let item of addToCardList) {
				let cardProdict = document.createElement("div");
				cardProdict.setAttribute("class", "card-product");
				let imgContainer = document.createElement("img");
				imgContainer.setAttribute("src", `${showInCardProductData(item.id, "image", "src")}`);
				imgContainer.setAttribute("alt", `${showInCardProductData(item.id, "image", "alt")}`);
				cardProdict.appendChild(imgContainer);
				let cardProduictsRight = document.createElement("div");
				cardProduictsRight.setAttribute("class", "card-product-right");
				cardProdict.appendChild(cardProduictsRight);
				let pProductName = document.createElement("p");
				let pProductNameContent = document.createTextNode(`${showInCardProductData(item.id, "name")}`);
				pProductName.appendChild(pProductNameContent);
				cardProduictsRight.appendChild(pProductName);
				let pBrandName = document.createElement("p");
				let pPBrandNameContent = document.createTextNode(`${showInCardProductData(item.id, "brandID")}`);
				pBrandName.appendChild(pPBrandNameContent);
				cardProduictsRight.appendChild(pBrandName);
				let pProductPrice = document.createElement("p");
				let pProductPriceContent = document.createTextNode(`${showInCardProductData(item.id, "price", "new")}`);
				pProductPrice.appendChild(pProductPriceContent);
				cardProduictsRight.appendChild(pProductPrice);
				let cardProductTools = document.createElement("div");
				cardProductTools.setAttribute("class", "card-product-tools");
				cardProduictsRight.appendChild(cardProductTools);
				let cardProductQuantity = document.createElement("div");
				cardProductQuantity.setAttribute("class", "card-product-quantity");
				let inputValueMinus = document.createElement("input");
				inputValueMinus.setAttribute("type", "button");
				inputValueMinus.setAttribute("class", "quantityRegul");
				inputValueMinus.setAttribute("data-id", `${item.id}`);
				inputValueMinus.setAttribute("value", "-");
				cardProductQuantity.appendChild(inputValueMinus);
				let itemQuantity = document.createElement("p");
				let itemQuantityContent = document.createTextNode(`${item.quantity}`);
				itemQuantity.appendChild(itemQuantityContent);
				cardProductQuantity.appendChild(itemQuantity);
				let inputValuePlus = document.createElement("input");
				inputValuePlus.setAttribute("type", "button");
				inputValuePlus.setAttribute("class", "quantityRegul");
				inputValuePlus.setAttribute("data-id", `${item.id}`);
				inputValuePlus.setAttribute("value", "+");
				cardProductQuantity.appendChild(inputValuePlus);
				cardProductTools.appendChild(cardProductQuantity);
				let iBin = document.createElement("i");
				iBin.setAttribute("class", "fa fa-trash");
				iBin.setAttribute("data-id", `${item.id}`);
				iBin.setAttribute("aria-hidden", "true");
				cardProductTools.appendChild(iBin);
				container.appendChild(cardProdict);
			}
		} else {
			let pTag = document.createElement("p");
			let pTagContent = document.createTextNode("Card is empty.");
			pTag.appendChild(pTagContent);
			pTag.setAttribute("id", "empty-card");
			container.appendChild(pTag);
		}

		if (addToCardList != null && checkoutContainer != null) {
			console.log(2);
			container = document.getElementById("checkout-product-list");
			container.innerHTML = "";
			for (let item of addToCardList) {
				let cardProdict = document.createElement("div");
				cardProdict.setAttribute("class", "card-product");
				let imgContainer = document.createElement("img");
				imgContainer.setAttribute("src", `${showInCardProductData(item.id, "image", "src")}`);
				imgContainer.setAttribute("alt", `${showInCardProductData(item.id, "image", "alt")}`);
				cardProdict.appendChild(imgContainer);
				let cardProduictsRight = document.createElement("div");
				cardProduictsRight.setAttribute("class", "card-product-right");
				cardProdict.appendChild(cardProduictsRight);
				let pProductName = document.createElement("p");
				let pProductNameContent = document.createTextNode(`${showInCardProductData(item.id, "name")}`);
				pProductName.appendChild(pProductNameContent);
				cardProduictsRight.appendChild(pProductName);
				let pBrandName = document.createElement("p");
				let pPBrandNameContent = document.createTextNode(`${showInCardProductData(item.id, "brandID")}`);
				pBrandName.appendChild(pPBrandNameContent);
				cardProduictsRight.appendChild(pBrandName);
				let pProductPrice = document.createElement("p");
				let pProductPriceContent = document.createTextNode(`${showInCardProductData(item.id, "price", "new")}`);
				pProductPrice.appendChild(pProductPriceContent);
				cardProduictsRight.appendChild(pProductPrice);
				container.appendChild(cardProdict);
			}
		} else if (checkoutContainer != null) {
			container = document.getElementById("checkout-product-list");
			container.innerHTML = "";
		}
		deleteProducts();
		classGe();
	}

	function totalPrice() {
		let addToCardList = jsonParse("addToCardList");
		let totalPrice = 0;
		let priceContainer = document.getElementById("card-total-price");
		let checkoutContainer = document.getElementById("checkout-total");

		if (addToCardList != null && addToCardList != "undefined") {
			let quantityPrice = addToCardList.map(function (el) {
				let productsArray = jsonParse("productsLocal");
				for (let item of productsArray) {
					if (item.id == el.id) {
						return el.quantity * priceCalculator(item.price.old, item.price.discount);
					}
				}
			});
			for (let item of quantityPrice) {
				totalPrice += item;
			}
			priceContainer.innerHTML = `Total: ${totalPrice.toFixed(2)}$`;
		}
		if (checkoutContainer != null && addToCardList != "undefined") {
			checkoutContainer.innerHTML = `Total: ${totalPrice.toFixed(2)}$`;
		}
	}
	function calculateItemPrice(itemID, price = null) {
		let addToCardList = jsonParse("addToCardList");
		let filtered = addToCardList.filter(function (el) {
			return el.id == itemID;
		});
		if (price == null) {
			let productsArray = jsonParse("productsLocal");
			let filteredPrice = productsArray.filter(function (el) {
				return el.id == itemID;
			});
			price = priceCalculator(filteredPrice[0].price.old, filteredPrice[0].price.discount);
		}
		let totalPrice = filtered[0].quantity * price;
		return `${price}$ x ${filtered[0].quantity} = ${totalPrice.toFixed(2)}$`;
	}

	function showInCardProductData(itemID, objectName, objectName2 = null) {
		let productsArray = jsonParse("productsLocal");
		let productName = productsArray.filter(function (el) {
			return el.id == itemID;
		});
		if (objectName == "brandID") {
			let brandsArray = jsonParse("brandsLocal");
			for (let item of brandsArray) {
				if (productName[0].brandID == item.id) {
					return item.name;
				}
			}
		}
		if (objectName == "price") {
			return calculateItemPrice(productName[0].id, productName[0][objectName][objectName2]);
		}
		if (objectName2 != null) {
			return productName[0][objectName][objectName2];
		} else {
			return productName[0][objectName];
		}
	}
	function classGe() {
		let quantityRegulList = document.querySelectorAll(".quantityRegul");
		for (let item of quantityRegulList) {
			item.addEventListener("click", function () {
				let dataQuantity = jsonParse("addToCardList");
				if (this.value == "+") {
					for (let data of dataQuantity) {
						if (data.id == this.getAttribute("data-id")) {
							data.quantity += 1;
							localStorage.setItem("addToCardList", JSON.stringify(dataQuantity));
							this.parentElement.getElementsByTagName("p")[0].innerHTML = data.quantity;
						}
					}
				} else {
					for (let data of dataQuantity) {
						if (data.id == this.getAttribute("data-id")) {
							if (data.quantity > 1) {
								data.quantity -= 1;
								localStorage.setItem("addToCardList", JSON.stringify(dataQuantity));
								this.parentElement.getElementsByTagName("p")[0].innerHTML = data.quantity;
							}
						}
					}
				}
				totalPrice();
				calculateItemPrice(item.getAttribute("data-id"));
				inCardProductsShow();
			});
		}
	}

	function deleteProducts() {
		let binItems = document.querySelectorAll(".fa-trash");
		for (let item of binItems) {
			item.addEventListener("click", () => {
				let addToCardList = jsonParse("addToCardList");
				for (let data of addToCardList) {
					if (data.id == item.getAttribute("data-id")) {
						let filteredList = addToCardList.filter(function (el) {
							return el.id !== `${data.id}`;
						});
						localStorage.setItem("addToCardList", JSON.stringify(filteredList));
					}
				}
				if (jsonParse("addToCardList").length == 0) {
					localStorage.removeItem("addToCardList");
				}
				inCardProductsShow();
				cardMessages("Product deleted from card!");
			});
		}
		totalPrice();
	}
	function deleteAllProducts() {
		localStorage.removeItem("addToCardList");
		cardMessages("Deleted all products from card");
		inCardProductsShow();
		totalPrice();
	}

	eventListener("delete-all-products", "id", "click", deleteAllProducts);
	function jsonParse(data) {
		let jsonData = JSON.parse(localStorage.getItem(`${data}`));
		return jsonData;
	}
	function resetFilters() {
		let brandsFilters = document.querySelectorAll(".brands-filter-item");
		let categoriesFilters = document.querySelectorAll(".category-filter-item");
		let connectionTypesFilters = document.querySelectorAll(".connection-type-filter-item");
		resetCheckbox(brandsFilters);
		resetCheckbox(categoriesFilters);
		resetCheckbox(connectionTypesFilters);
		let reviewsFilter = document.getElementById("reviews-range-sllider");
		reviewsFilter.value = 1;
		let productsArray = jsonParse("productsLocal");
		showProducts(productsArray);
	}
	function resetCheckbox(arrayName) {
		for (let item of arrayName) {
			item.checked = false;
		}
	}

	inCardProductsShow();

	const url = window.location.pathname;
	if (url == "/store.html") {
		fetchData("products", showProducts);
		fetchData("brands", showFiltersBrand);
		fetchData("categories", showFiltersCategory);
		fetchData("connectionTypes", showFiltersConnectionType);
		showReviews();
		var sortingPlaceholder = document.getElementById("sort-product-placeholder");
		sortingPlaceholder.addEventListener("change", function () {
			let productsArray = jsonParse("productsLocal");
			productsArray.sort(function (a, b) {
				if (sortingPlaceholder.value == 0) {
					return 0;
				} else if (sortingPlaceholder.value == 1) {
					a = parseFloat(priceCalculator(a.price.old, a.price.discount));
					b = parseFloat(priceCalculator(b.price.old, b.price.discount));
					if (a < b) {
						return -1;
					}
					if (a > b) {
						return 1;
					}
					if (a == b) {
						return 0;
					}
				} else if (sortingPlaceholder.value == 2) {
					a = parseFloat(priceCalculator(a.price.old, a.price.discount));
					b = parseFloat(priceCalculator(b.price.old, b.price.discount));
					if (a > b) {
						return -1;
					}
					if (a < b) {
						return 1;
					} else {
						return 0;
					}
				} else if (sortingPlaceholder.value == 3) {
					if (a.name < b.name) {
						return -1;
					}
					if (a.name > b.name) {
						return 1;
					} else {
						return 0;
					}
				} else if (sortingPlaceholder.value == 4) {
					if (a.name > b.name) {
						return -1;
					}
					if (a.name < b.name) {
						return 1;
					} else {
						return 0;
					}
				}
			});
			showProducts(productsArray);
		});
		let resetBtn = document.getElementById("reset-filter");
		resetBtn.addEventListener("click", resetFilters);
	} else if (url == "/index.html" || url == "/") {
		fetchData("products", topDiscountProducts);
		let slideIndex = 0;
		let slideTimer;
		const slideDelay = 3;
		const slides = document.getElementsByClassName("slide");
		ShowSlide = (index) => {
			if (index == slides.length) slideIndex = 0;
			else if (index < 0) slideIndex = slides.length - 1;
			else slideIndex = index;
			for (i = 0; i < slides.length; i++) {
				slides[i].style.display = "none";
			}
			SlideReset();
			slides[slideIndex].style.display = "block";
		};
		SlideReset = () => {
			window.clearInterval(slideTimer);
			setTimeout(function () {
				slideTimer = window.setInterval(function () {
					ShowSlide((slideIndex += 1));
				}, slideDelay * 1000);
			}, 10);
		};
		neg.addEventListener("click", function () {
			ShowSlide((slideIndex -= 1));
		});
		pos.addEventListener("click", function () {
			ShowSlide((slideIndex += 1));
		});
		ShowSlide(slideIndex);
	} else if (url == "/checkout.html") {
		inCardProductsShow();

		// Buying form validation
		let contactSubmit = document.getElementById("contact-submit");
		let mailNotSent = true;
		contactSubmit.addEventListener("click", () => {
			const regularFullName = /^[A-ZČĆŽĐŠ][a-zćčžđš]{1,14}\s([A-ZČĆŽĐŠ][a-zćčžđš]{1,14})?\s?[A-ZČĆŽŠĐ][a-zćčžđš]{1,19}$/;
			let fullNameField = document.getElementById("fullName");
			let fullNameFieldValue = fullNameField.value;
			let fullNameConfirm;
			let mailConfirm;
			let messageConfirm;
			if (regularFullName.test(fullNameFieldValue)) {
				fullNameField.nextElementSibling.innerHTML = "";
				fullNameField.nextElementSibling.setAttribute("class", "good-form-element");
				fullNameConfirm = true;
			} else {
				fullNameField.nextElementSibling.innerHTML = "Full Name is not as expected";
				fullNameField.nextElementSibling.setAttribute("class", "bad-form-element");
				fullNameConfirm = false;
			}
			const regularMail = /^[a-zA-Z0-9]([a-z]|[0-9])+\.?-?_?([a-z]|[0-9])*\.?([a-z]|[0-9])*\@[a-z]{3,}\.([a-z]{2,4}\.)?([a-z]{2,4})$/g;
			let mailField = document.getElementById("email");
			let mailFieldFieldValue = mailField.value;
			if (regularMail.test(mailFieldFieldValue)) {
				mailField.nextElementSibling.innerHTML = "";
				mailField.nextElementSibling.setAttribute("class", "good-form-element");
				mailConfirm = true;
			} else {
				mailField.nextElementSibling.innerHTML = "E-mail is not as expected!";
				mailField.nextElementSibling.setAttribute("class", "bad-form-element");
				mailConfirm = false;
			}
			const regularPostalCode = /^[0-9]{5}$/;
			let postalCode = document.getElementById("postal-code");
			postalCodeFieldValue = postalCode.value;
			if (regularPostalCode.test(postalCodeFieldValue)) {
				postalCode.nextElementSibling.innerHTML = "";
				postalCode.nextElementSibling.setAttribute("class", "good-form-element");
				mailConfirm = true;
			} else {
				postalCode.nextElementSibling.innerHTML = "Postal code is not as expected!";
				postalCode.nextElementSibling.setAttribute("class", "bad-form-element");
				mailConfirm = false;
			}
			const regularStreetAddress = /^[A-Za-zČĆŽĐŠčćžđš'\.\-\s\,0-9]{3,}$/;
			let streetAddress = document.getElementById("address");
			streetAddressFieldValue = streetAddress.value;
			if (regularStreetAddress.test(streetAddressFieldValue)) {
				streetAddress.nextElementSibling.innerHTML = "";
				streetAddress.nextElementSibling.setAttribute("class", "good-form-element");
				mailConfirm = true;
			} else {
				streetAddress.nextElementSibling.innerHTML = "Address is not as expected!";
				streetAddress.nextElementSibling.setAttribute("class", "bad-form-element");
			}
			let messageBox = document.getElementById("message");
			if (messageBox.value.length > 450) {
				messageBox.nextElementSibling.innerHTML = "Message can't be longer than 450 characters!";
				messageBox.nextElementSibling.setAttribute("class", "bad-form-element");
				messageConfirm = false;
			} else if (messageBox.value == "" || messageBox.value == null || messageBox.value.length == 0) {
				messageBox.nextElementSibling.innerHTML = "Message can't be empty!";
				messageBox.nextElementSibling.setAttribute("class", "bad-form-element");
				messageConfirm = false;
			} else if (messageBox.value != "" && messageBox.value != null && messageBox.value.length < 20) {
				messageBox.nextElementSibling.innerHTML = "Message can't be smaller then 20 characters!";
				messageBox.nextElementSibling.setAttribute("class", "bad-form-element");
				messageConfirm = false;
			} else {
				messageBox.nextElementSibling.innerHTML = "";
				messageBox.nextElementSibling.setAttribute("class", "good-form-element");
				messageConfirm = true;
			}
			let addToCardLocal = jsonParse("addToCardList");
			if (fullNameConfirm && mailConfirm && messageConfirm && mailNotSent && addToCardLocal != null) {
				cardMessages("Mail sent!");
				mailNotSent = false;
			} else if (mailNotSent == false) {
				cardMessages("Mail already sent!");
			} else if (addToCardLocal == null) {
				cardMessages("Card is empty!");
			}
		});
	}

	function topDiscountProducts(data) {
		let filteredDiscount = data.filter(function (el) {
			return el.price.discount >= 10;
		});
		showProducts(filteredDiscount);
	}

	function aboutMePage() {
		let aboutMeLink = document.querySelectorAll(`[href="#about-me.html"]`);
		for (let item of aboutMeLink) {
			item.addEventListener("click", () => {
				let bodyEl = document.getElementsByTagName("body");
				let header = document.getElementsByTagName("header");
				let aboutMeContainer = document.querySelector("#about-me-container");
				if (aboutMeContainer == null) {
					header[0].innerHTML += `<section id="about-me-container">
						<div id="about-me">
							<div id="about-me-left">
								<img src="assets/img/nikola-timotic.png" alt="profile-img" />
								<div id="about-me-info">
									<ul id="about-me-info-content">
										<li>
											<p>
												Mail:
												<a href="mailto:nt&#46;timotic&#64;gmail&#46;com">nt&#46;timotic&#64;gmail&#46;com</a>
											</p>
										</li>
										<li>
											<p>
												Phone:
												<a href="tel:060-123-4567">0601234567</a>
											</p>
										</li>
										<li>
											<p>Index: <span>173/20</span></p>
										</li>
									</ul>
									<ul id="about-social">
										<li>
											<a href="https://www.facebook.com">
												<i class="fab fa-facebook-square"></i>
											</a>
										</li>
										<li>
											<a href="https://www.instagram.com">
												<i class="fab fa-instagram-square"></i>
											</a>
										</li>
										<li>
											<a href="https://www.linkedin.com/in/nikolatimotic/">
												<i class="fab fa-linkedin"></i>
											</a>
										</li>
									</ul>
								</div>
							</div>
							<div id="about-me-right">
								<h2>About Me</h2>
								<div id="about-me-content">
									<p id="about-me-text">Hi, my name is Nikola. I’m a Web Developer located in Serbia. I have a passion for UI and UX design. I'm quietly confident, naturally curious, and perpetually working on improving my chops one design problem at a time. I'm a very well-organized person and a problem solver.</p>
									<div id="quote-box">
										<cite id="quote"></cite>
										<p id="author"></p>
									</div>
								</div>
							</div>
							<div id="about-me-close">
								<div class="close cross" id="about-me-exit"></div>
							</div>
						</div>
					</section>`;
					quoteGeneratorInterval = setInterval(quoteGenerator, 2000);
					aboutMeModalRemoved = false;
				}
				// About me
				let aboutMeExit = document.getElementById("about-me-close");
				aboutMeExit.addEventListener("click", () => {
					header[0].removeChild(header[0].lastChild);
					aboutMeModalRemoved = true;
					clearInterval(quoteGeneratorInterval);
				});
			});
		}
	}
	// Quote generator
	var random1;
	var random2;

	function quoteGenerator() {
		let quoteList = jsonParse("quotesLocal");
		if (!aboutMeModalRemoved) {
			random1 = Math.floor(Math.random() * quoteList.length);
			while (random1 == random2) {
				random1 = Math.floor(Math.random() * quoteList.length);
			}
			document.getElementById("quote").innerHTML = quoteList[random1].quote;
			document.getElementById("author").innerHTML = quoteList[random1].author;
			random2 = random1;
		} else {
			clearInterval(quoteGeneratorInterval);
		}
	}
	var burger = document.getElementById("nav-close-container");
	burger.addEventListener("click", () => {
		document.getElementById("nav-close").classList.toggle("cross");
		document.getElementById("navbar-container").classList.toggle("nav-active");
	});
};
