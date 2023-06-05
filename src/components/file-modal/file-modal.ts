import template from './file-modal.hbs';
import Block from '../../core/Block';

type TFileModal = {
    showModal: boolean,
    dialogId: string,
    title: string,
    titleError: string,
    fileText: string,
    fileError: string,
    submitText: string
};
export default class FileModal extends Block {
  
  constructor(props: TFileModal) {
    const nextProps = {
      ...props,
    };
    super('div', nextProps, template);
  }

  render() {
    return this.compile(this.props);
  }
}

