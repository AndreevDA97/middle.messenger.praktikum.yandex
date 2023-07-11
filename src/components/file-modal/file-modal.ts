import template from './file-modal.hbs';
import Block from '../../core/Block';

type TFileModal = {
  showModal: boolean,
  dialogId: string,
  title: string,
  titleError: string,
  fileText: string,
  fileError: string,
  fieldName: string,
  submitText: string,
  onSubmit?: (form: HTMLFormElement, value: File) => void
};
export default class FileModal extends Block {
  constructor(props: TFileModal) {
    const nextProps = {
      ...props,
    };
    super('div', nextProps, template);
  }

  render() {
    setTimeout(() => {
      const formElement = document
        .querySelector<HTMLElement>(`#${this.props.dialogId} form`);
      formElement!.onsubmit = async (event) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const input = form.elements.namedItem(this.props.fieldName) as HTMLInputElement;
        const file = input.files!.item(0);
        this.props.onSubmit(form, file);
      };
      window.additionalEffects.clear();
      window.additionalEffects.create();
    }, 100);
    return this.compile(this.props);
  }
}
