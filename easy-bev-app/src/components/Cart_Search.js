import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';




class Cart_Search extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            tags: []
        };

        this.getChoice = this.getChoice.bind(this);

    }

    getChoice = (event, values) => {
        this.setState({
            tags: values
        }, () => {
            // This will output an array of objects
            // given by Autocompelte options property.
            this.props.callback(this.state.tags);
        });
    }



    render() {

        return (
            <React.Fragment>
                <Autocomplete
                    id="search_bar"
                    options={inventory}
                    getOptionLabel={(option) => option.name}
                    style={{ width: 400 }}
                    onChange={this.getChoice}
                    renderInput={(params) => <TextField {...params} label="Please select item" variant="outlined" />}
                />
            </React.Fragment>
        );
    }
}



// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const inventory = [
    { name: 'WhiteClaw 6 Pack', price: 14.99 },
    { name: 'Svedka 14 Count', price: 109.99 },
    { name: 'Smirnoff Blue Raspberry 2 Count', price: 21.99 },
    { name: 'BudLight 3 Count Keg', price: 250.00 },
    { name: 'Mikes Hard Lemonade 6 Count', price: 10.89 },
];


const style = {
    search_bar: {
        width: "50%",
    },

}



export default (Cart_Search);