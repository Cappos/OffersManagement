import gql from 'graphql-tag';
import 'graphql-type-json';

export default gql`
    mutation CreateGroup($name: String!, $subTotal: Float, $modulesNew: JSON, $order: Int) {
        addGroup(name: $name, subTotal: $subTotal, modulesNew: $modulesNew, order: $order){
            name
            subTotal
        }
    }
`;