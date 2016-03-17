import React from 'react';
import {connect} from 'react-redux';
import {navigateTo} from '../actions/navigation';
import Foo from '../components/Foo';
import Bar from '../components/Bar';

class Application extends React.Component {
  constructor() {
    super();
    this.navigateToFoo = this.navigateToFoo.bind(this);
    this.navigateToBar = this.navigateToBar.bind(this);
  }

  navigateToFoo() {
    this.props.onNavigate('foo');
  }

  navigateToBar() {
    this.props.onNavigate('bar');
  }

  render() {
    const {screen} = this.props;
    let screenToRender = null;

    if (screen === 'foo') {
      screenToRender = <Foo />;
    }

    if (screen === 'bar') {
      screenToRender = <Bar />;
    }

    return (
      <div>
        <header>
          <h1>Hello World!</h1>
          <ul>
            <li>
              <a href='#' onClick={this.navigateToFoo}>Go to Foo</a>
            </li>
            <li>
              <a href='#' onClick={this.navigateToBar}>Go to Bar</a>
            </li>
          </ul>
        </header>
        <section>
          {screenToRender}
        </section>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    screen: state.screen
  };
};

const mapDispatchToProps = {
  onNavigate: navigateTo
};

export default connect(mapStateToProps, mapDispatchToProps)(Application);
