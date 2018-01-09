import gql from 'graphql-tag';
import 'graphql-type-json';

export default gql`
    mutation CreateGroup($id: ID!, $name: String!, $subTotal: Float, $modulesNew: JSON) {
        addGroup(id:$id, name: $name, subTotal: $subTotal, modulesNew: $modulesNew){
            name
        }
    }
`;