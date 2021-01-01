import { shallow } from 'enzyme';

import Button from '../buttons/Button';
import PeelButton from './PeelButton';

describe('<PeelButton />', () => {
  const renderComponent = (propOverrides = {}) =>
    shallow(
      <PeelButton
        canPeel
        handlePeel={jest.fn().mockName('handlePeel')}
        peelWinsGame={false}
        {...propOverrides}
      />
    );

  it('renders properly', () => {
    expect(renderComponent()).toMatchSnapshot();
  });

  describe('tooltip text', () => {
    it('gives help on how to disable button if cannot peel', () => {
      expect(renderComponent({ canPeel: false }).props().title).toEqual(
        'You must have a valid connected board to peel'
      );
    });

    it('shows win game text when can peel and peel wins game', () => {
      expect(
        renderComponent({ canPeel: true, peelWinsGame: true }).props().title
      ).toEqual('Win the game!');
    });

    it('shows peel description when can peel but peel does not win game', () => {
      expect(
        renderComponent({ canPeel: true, peelWinsGame: false }).props().title
      ).toEqual('Get a new tile and send one to everyone else');
    });
  });

  describe('button text', () => {
    it('shows bananas when peel wins game', () => {
      expect(
        renderComponent({ peelWinsGame: true }).find(Button).props().children
      ).toEqual('Bananas!');
    });

    it('shows peel when peel does not win game', () => {
      expect(
        renderComponent({ peelWinsGame: false }).find(Button).props().children
      ).toEqual('Peel!');
    });
  });

  describe('disabled state', () => {
    it('is disabled when cannot peel', () => {
      expect(
        renderComponent({ canPeel: false }).find(Button).props().disabled
      ).toEqual(true);
    });

    it('is not disabled when can peel', () => {
      expect(
        renderComponent({ canPeel: true }).find(Button).props().disabled
      ).toEqual(false);
    });
  });
});
