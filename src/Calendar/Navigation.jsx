import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  getCenturyLabel,
  getDecadeLabel,
  getBeginNext,
  getBeginNext2,
  getBeginPrevious,
  getBeginPrevious2,
  getYear,
} from '../shared/dates';
import { formatMonthYear } from '../shared/dateFormatter';

const allViews = ['century', 'decade', 'year', 'month'];

export default class Navigation extends Component {
  get drillDownAvailable() {
    const { view, views } = this.props;
    return views.indexOf(view) < views.length - 1;
  }

  get drillUpAvailable() {
    const { view, views } = this.props;
    return views.indexOf(view) > 0;
  }

  get prevButtonDisabled() {
    const { activeStartDate: date, minDate, view } = this.props;
    const previousActiveStartDate = getBeginPrevious(view, date);
    if (previousActiveStartDate.getFullYear() < 1000) {
      return true;
    }
    return minDate && minDate >= date;
  }

  get prev2ButtonDisabled() {
    const { activeStartDate: date, minDate, view } = this.props;
    const previousActiveStartDate = getBeginPrevious2(view, date);
    if (previousActiveStartDate.getFullYear() < 1000) {
      return true;
    }
    return minDate && minDate >= date;
  }

  get nextButtonDisabled() {
    const { activeStartDate: date, maxDate, view } = this.props;
    const nextActiveStartDate = getBeginNext(view, date);
    return maxDate && maxDate <= nextActiveStartDate;
  }

  get next2ButtonDisabled() {
    const { activeStartDate: date, maxDate, view } = this.props;
    const nextActiveStartDate = getBeginNext2(view, date);
    return maxDate && maxDate <= nextActiveStartDate;
  }

  onClickPrevious = () => {
    const { activeStartDate: date, view, setActiveStartDate } = this.props;
    setActiveStartDate(getBeginPrevious(view, date));
  }

  onClickNext = () => {
    const { activeStartDate: date, view, setActiveStartDate } = this.props;
    setActiveStartDate(getBeginNext(view, date));
  }

  onClickPrevious2 = () => {
    const { activeStartDate: date, view, setActiveStartDate } = this.props;
    setActiveStartDate(getBeginPrevious2(view, date));
  }

  onClickNext2 = () => {
    const { activeStartDate: date, view, setActiveStartDate } = this.props;
    setActiveStartDate(getBeginNext2(view, date));
  }

  get label() {
    const { activeStartDate: date, view } = this.props;

    switch (view) {
      case 'century':
        return getCenturyLabel(date);
      case 'decade':
        return getDecadeLabel(date);
      case 'year':
        return getYear(date);
      case 'month':
        return formatMonthYear(date);
      default:
        throw new Error(`Invalid view: ${view}.`);
    }
  }

  render() {
    const { label } = this;
    const { drillUp, view } = this.props;

    return (
      <div
        className="react-calendar__navigation"
        style={{ display: 'flex' }}
      >
        {
          view !== 'century' &&
          <button
            className="react-calendar__navigation__arrow"
            disabled={this.prev2ButtonDisabled}
            onClick={this.onClickPrevious2}
          >
            {this.props.prev2Label}
          </button>
        }
        <button
          className="react-calendar__navigation__arrow"
          disabled={this.prevButtonDisabled}
          onClick={this.onClickPrevious}
        >
          {this.props.prevLabel}
        </button>
        <button
          className="react-calendar__navigation__label"
          onClick={drillUp}
          disabled={!this.drillUpAvailable}
          style={{ flexGrow: 1 }}
        >
          {label}
        </button>
        <button
          className="react-calendar__navigation__arrow"
          disabled={this.nextButtonDisabled}
          onClick={this.onClickNext}
        >
          {this.props.nextLabel}
        </button>
        {
          view !== 'century' &&
          <button
            className="react-calendar__navigation__arrow"
            disabled={this.next2ButtonDisabled}
            onClick={this.onClickNext2}
          >
            {this.props.next2Label}
          </button>
        }
      </div>
    );
  }
}

Navigation.defaultProps = {
  next2Label: '»',
  nextLabel: '›',
  prev2Label: '«',
  prevLabel: '‹',
};

const viewPropType = PropTypes.oneOf(allViews);

Navigation.propTypes = {
  activeStartDate: PropTypes.instanceOf(Date).isRequired,
  drillUp: PropTypes.func.isRequired,
  maxDate: PropTypes.instanceOf(Date),
  minDate: PropTypes.instanceOf(Date),
  next2Label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  nextLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  prev2Label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  prevLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  setActiveStartDate: PropTypes.func.isRequired,
  view: viewPropType.isRequired,
  views: PropTypes.arrayOf(viewPropType).isRequired,
};
