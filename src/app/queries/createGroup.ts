import gql from 'graphql-tag';
import 'graphql-type-json';

export default gql`
    mutation CreateGroup($name: String!, $subTotal: Float, $modulesNew: JSON) {
        addGroup(name: $name, subTotal: $subTotal, modulesNew: $modulesNew){
            name
            subTotal
        }
    }
`;