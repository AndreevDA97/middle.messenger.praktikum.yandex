/* eslint-disable no-undef */
import Block, { TProps } from '../src/core/Block';

class TestBlock extends Block {
  constructor(props: TProps | undefined) {
    super('div', props);
  }

  render() {
    return this.props.data;
  }
}

describe('Block tests', () => {

  test('Block create', () => {
    const testBlock = new TestBlock({ data: 'test' });
    expect(testBlock.getContent().outerHTML).toBe('<div>test</div>');
  });

  test('Block event', () => {
    const testBlock = new TestBlock({
      events: {
        click: () => {},
      },
    });
    expect(testBlock.events.click !== undefined).toBe(true);
  });

  test('Block update', () => {
    const testBlock = new Block('div');
    expect(testBlock.componentDidUpdate({}, { data: 'test' })).toBe(true);
  });

  test('Block children', () => {
    const testChildren = new TestBlock({ data: 'child' });
    const testBlock = new TestBlock({
      childrenBlock: testChildren,
    });
    expect(testBlock.children.childrenBlock.getContent().innerHTML).toBe('child');
  });
});
