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
            console.log(this.state.tags);
        });
    }



    render() {

        return (
            <React.Fragment>
                <Autocomplete
                    id="search_bar"
                    options={top100Films}
                    getOptionLabel={(option) => option.title}
                    style={{ width: 400 }}
                    onChange={this.getChoice}
                    renderInput={(params) => <TextField {...params} label="Combo box" variant="outlined" />}
                />
            </React.Fragment>
        );
    }
}



// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films = [
    { title: 'The Shawshank Redemption', year: 1994 },
    { title: 'The Godfather', year: 1972 },
    { title: 'The Godfather: Part II', year: 1974 },
    { title: 'The Dark Knight', year: 2008 },
    { title: '12 Angry Men', year: 1957 },
    { title: "Schindler's List", year: 1993 },
    { title: 'Pulp Fiction', year: 1994 },
    { title: 'The Lord of the Rings: The Return of the King', year: 2003 },
    { title: 'The Good, the Bad and the Ugly', year: 1966 },
    { title: 'Fight Club', year: 1999 },
    { title: 'The Lord of the Rings: The Fellowship of the Ring', year: 2001 },
    { title: 'Star Wars: Episode V - The Empire Strikes Back', year: 1980 },
    { title: 'Forrest Gump', year: 1994 },
    { title: 'Inception', year: 2010 },
    { title: 'The Lord of the Rings: The Two Towers', year: 2002 },
    { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
    { title: 'Goodfellas', year: 1990 },
    { title: 'The Matrix', year: 1999 },
    { title: 'Seven Samurai', year: 1954 },
    { title: 'Star Wars: Episode IV - A New Hope', year: 1977 },
    { title: 'City of God', year: 2002 },
    { title: 'Se7en', year: 1995 },
];


const style = {
    search_bar: {
        width: "50%",
    },

}



export default (Cart_Search);