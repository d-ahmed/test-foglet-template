import React, {Component} from 'react';
import './Navigation.css';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';

class Navigation extends Component{

    onMove(evt){
        this.props.onNavigation(evt);
    }

    render(){
        return (
            <div className="Navigation">
                <Button className="Btn keyboard_arrow_left" onClick={this.onMove.bind(this, 'left')}>
                    <Icon>keyboard_arrow_left</Icon>
                </Button>
                <Button className="Btn keyboard_arrow_up" onClick={this.onMove.bind(this, 'up')}>
                    <Icon>keyboard_arrow_up</Icon>
                </Button>
                <Button className="Btn keyboard_arrow_right" onClick={this.onMove.bind(this, 'right')}>
                    <Icon>keyboard_arrow_right</Icon>
                </Button>
                <Button className="Btn keyboard_arrow_down" onClick={this.onMove.bind(this, 'down')}>
                    <Icon>keyboard_arrow_down</Icon>
                </Button>
            </div>
        );
    }
}

export default Navigation;