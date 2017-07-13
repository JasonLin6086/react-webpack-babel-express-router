import { ITEM_CLICKED, ITEM_VIEW, ADD_ITEM } from '../actions/list_actions';

let ListItems = [
    { name: 'Domains', description: 'Show domains view' },
    { name: 'Services', description: 'Show services view' },
    { name: 'Instances', description: 'Show instances view' }
];

const INITIAL_STATE = { all: ListItems, item: null};

export default function(state = INITIAL_STATE, action) {
    switch(action.type) {
        case ITEM_CLICKED:
            return { ...state, item: action.payload };
        case ADD_ITEM:
            return {...state, all: [...state.all, action.payload ] };
        case ITEM_VIEW:
            switch(action.payload) {
                case 'Domains':
                    return {...state, item: ListItems[0] };
                case 'Services':
                    return {...state, item: ListItems[1] };
                case 'Instances':
                    return {...state, item: ListItems[2] };
            }
    }
    return state;
}
