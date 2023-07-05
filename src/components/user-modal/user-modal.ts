import template from './user-modal.hbs';
import Block from '../../core/Block';

export type TUserModal = {
  showModal: boolean,
  dialogId: string,
  title: string,
  titleError?: string,
  fieldName: string,
  fieldTitle: string,
  fieldPlaceholder?: string,
  fieldDisabled?: boolean,
  fieldValue?: string,
  fieldError?: string,
  submitText: string,
  onSubmit?: (form: HTMLFormElement, value: string) => void
};
export default class UserModal extends Block {
  constructor(props: TUserModal) {
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
        this.props.onSubmit(form, input.value);
      };
    }, 100);
    return this.compile(this.props);
  }
}
