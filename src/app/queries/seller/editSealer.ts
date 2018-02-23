import gql from 'graphql-tag';

export default gql`
    mutation UpdateSealer($id: ID!, $name: String!, $email: String!, $phone: String, $mobile: String) {
        editSealer(id: $id, name: $name, email: $email, phone: $phone, mobile: $mobile, ){
            name
        }
    }
`;
