// storage controller

// item controller
const ItemCtrl = (function () {
    // Item constructor
    const Item = function (id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }
    // data structure and state
    const data = {
        items: [],
        currentItem: null,
        totalCalories: 0,
    }

    // public methods
    return {
        logData: function () {
            return data;
        },
        getItems: function () {
            return data.items;
        },
        addItem: function (name, calories) {
            let ID = 0;
            // create id
            if (data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }
            // calories to number 
            calories = parseInt(calories);
            // create new item
            newItem = new Item(ID, name, calories);
            // add items to array
            data.items.push(newItem);
            return newItem;
        },
        getItemById: function (Id) {
            let found = '';
            // loop throuch the items
            data.items.forEach(function (item) {
                console.log(item.id)
                if (item.id == Id) {
                    found = item;
                }
            });
            return found;
        },

        updateItem: function (name, calories) {
            calories = parseInt(calories);
            let found = null;
            data.items.forEach((item) => {
                if (item.id == data.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            })
            return found;
        },
        getTotalCalories: function () {
            let total = 0;
            // loop through the item and total the figure
            data.items.forEach(function (item) {
                total += item.calories;
            })
            // set total calories
            data.totalCalories = total;
            // return total
            return data.totalCalories;
        },
        setCurrentItem: function (item) {
            data.currentItem = item;
        },
        getCurrentItem: function () {
            return data.currentItem
        }
    }
}());
// ui controller
const UICtrl = (function () {
    const UISelectors = {
        listItems: '#item-list li',
        itemList: '#item-list',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        addBtn: '.add-btn',
        backBtn: '.back-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
    }


    // public methods
    return {
        populateItemList(items) {
            let html = '';
            items.forEach(item => {
                html += `
        <li class="collection-item" id="item-${item.id}">
                <strong>${item.name}:</strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
            </li>
        `
            });
            // insert list item
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput: function () {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value,
            }
        },
        showTotalCalories: function (totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories
        },
        addListItem: function (item) {
            // show list item
            document.querySelector(UISelectors.itemList).style.display = 'block';
            // create Li element 
            const li = document.createElement('li');
            // add class name
            li.classList = 'collection-item';
            // add id
            li.id = `item-${item.id}`;
            // add html
            li.innerHTML = `<strong>${item.name}:</strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content"><i class="edit-item fas fa-pencil-alt"> </i></a>`
            // insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
        },
        updateListItem: function (item) {
            // create a vairaible
            let listItems = document.querySelectorAll(UISelectors.listItems)
            // turn node into an array
            listItems = Array.from(listItems);
            listItems.forEach((listItem) => {
                const itemID = listItem.getAttribute('id')
                if (itemID === `item-${item.id}`) {
                    document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}:</strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content"><i class="edit-item fas fa-pencil-alt"> </i></a>`
                }
            })
        },
        clearInput: function () {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';

        },
        addItemToForm: function () {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();

        },
        showEditState: function () {
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
        },
        clearEditState: function () {
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'none';

        },
        hideList: function () {
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        getSelectors: function () {
            return UISelectors;
        }
    }
}());

// app controller
const App = (function (ItemCtrl, UICtrl) {
    // load event listeners
    const loadEventListeners = function () {
        const UISelectors = UICtrl.getSelectors();

        // add item events
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
        // edit icon click
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);
        // actual event upload
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

        // disable submit on enter
        document.addEventListener('keypress', function (e) {
            if (e.keyCode == 13 || e.which == 13) {
                e.preventDefault()
            }
        })
    }
    const itemAddSubmit = function (e) {
        // get form input from  UI controller
        const input = UICtrl.getItemInput();

        // check if input is not empty

        if (input.name !== '' && input.calories !== '') {

            // add item
            const newItem = ItemCtrl.addItem(input.name, input.calories);
            // add new item to ui list
            UICtrl.addListItem(newItem);
            UICtrl.clearInput();
            // get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            // add total calorie to the UI
            UICtrl.showTotalCalories(totalCalories);

        }
        e.preventDefault();
    }
    const itemEditClick = function (e) {
        if (e.target.classList.contains('edit-item')) {

            // get list item id 
            const listId = e.target.parentNode.parentNode.id;

            // break into an array
            const listIdArr = listId.split('-');
            // get th actuall id
            const Id = parseInt(listIdArr[1]);
            // get item
            const itemToEdit = ItemCtrl.getItemById(Id);
            // set current item
            ItemCtrl.setCurrentItem(itemToEdit);
            // Add item to form
            UICtrl.addItemToForm();
        }
        e.preventDefault();
    }
    // item update
    const itemUpdateSubmit = function (e) {

        // get item input
        const input = UICtrl.getItemInput();
        // update item 
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        // update the UI
        UICtrl.updateListItem(updatedItem);
        // get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // add total calorie to the UI
        UICtrl.showTotalCalories(totalCalories);
        // clear edit state
        UICtrl.clearEditState();

        e.preventDefault();
    }

    // public methods
    return {
        init: function () {
            // set init state
            UICtrl.clearEditState();
            // fetch items from data structure
            const items = ItemCtrl.getItems();

            // check if item is empty
            if (items.length === 0) {
                UICtrl.hideList();
            } else {
                // populate items with list
                UICtrl.populateItemList(items);
            }
            // load event listeners
            loadEventListeners();
        }
    }

}(ItemCtrl, UICtrl));

App.init();