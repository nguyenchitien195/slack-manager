import React from 'react';
import { TextField } from '@material-ui/core';

class TableFilter extends React.Component {


    searchFile(e) {
        console.log(e.target.value);
    }
    render() {
        return(
            <div>
                <TextField
                    label='Search'
                    onChange={e => this.searchFile(e)}
                />
            </div>
        );
    }
}

export default TableFilter;