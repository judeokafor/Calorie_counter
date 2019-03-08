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
        getItemById : function (Id) {
            let found = '';
            // loop throuch the items
            data.items.forEach(function (item){
                console.log(item.id)
                if (item.id == Id) {
                    found = item;
                }
            });
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
        setCurrentItem : function (item){
data.currentItem = item;
        }
    }
}());
// ui controller
const UICtrl = (function () {
    const UISelectors = {
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
            <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`
            // insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
        },
        clearInput: function () {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';

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
        document.querySelector(UISelectors.itemList).addEventListener('click', itemUpdateSubmit);
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
    const itemUpdateSubmit = function (e) {
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
        }
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