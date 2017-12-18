import gql from 'graphql-tag';

export default gql`
    mutation AddSealer($name: String!, $email: String!, $phone: String, $mobile: String, $value: Int!) {
        addSealer(name: $name, email: $email, phone: $phone, mobile: $mobile, value: $value){
            _id,
            name
            email
            phone
            mobile
            value
        }
    }
`;
