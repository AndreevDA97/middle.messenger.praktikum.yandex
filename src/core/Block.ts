// @ts-ignore
// eslint-disable-next-line import/no-extraneous-dependencies
import { v4 as uuidv4 } from 'uuid';
import EventBus from './EventBus';

export interface TProps {
  [index: string]: any,
  children?: Record<string, Block>
}
export interface BlockClass<P extends TProps = any> extends Function {
  new (props: P): Block<P>;
  componentName?: string;
}
export default class Block<P extends TProps = any> {
  private static EVENTS: Record<string, string> = {
    INIT: 'init',
    FLOW_CDM: 'flow:component-did-mount',
    FLOW_CDU: 'flow:component-did-update',
    FLOW_CWU: 'flow:component-will-unmount',
    RENDER: 'flow:render',
  };

  public props: P;

  public templator: Function | undefined;

  public events: Record<string, Function> | any;

  private _prevProps: P;

  public children: Record<string, Block>;

  private readonly _id: string | null = null;

  public eventBus: () => EventBus;

  private _element: HTMLElement;

  private _meta: { tagName: string, propsAndChildren?: P } | null = null;

  constructor(tagName: string = 'div', propsAndChildren: P = {} as P, templator?: Function | undefined) {
    const eventBus = new EventBus();
    this._meta = {
      tagName,
      propsAndChildren,
    };
    const { children, props } = this._getChildrenAndProps(propsAndChildren);

    this.children = children;

    this.events = {};

    this.templator = templator;

    this._id = uuidv4();

    this.props = this._makePropsProxy(props || ({} as P));

    this.eventBus = () => eventBus;

    this._registerEvents(eventBus);

    eventBus.emit(Block.EVENTS.INIT);
  }

  /**
   * Хелпер, который проверяет, находится ли элемент в DOM дереве
   * И есть нет, триггерит событие COMPONENT_WILL_UNMOUNT
   */
  _checkInDom() {
    const elementInDOM = document.body.contains(this._element);

    if (elementInDOM) {
      setTimeout(() => this._checkInDom(), 1000);
      return;
    }

    this.eventBus().emit(Block.EVENTS.FLOW_CWU, this.props);
  }

  private _registerEvents(eventBus: EventBus): void {
    eventBus.on(Block.EVENTS.INIT, this._init.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CWU, this._componentWillUnmount.bind(this));
    eventBus.on(Block.EVENTS.RENDER, this._render.bind(this));
  }

  private _createResources(): void {
    const tagName = this._meta?.tagName;
    if (tagName) this._element = this._createDocumentElement(tagName);
    // if (typeof this.props.className === 'string') this._element.className = this.props.className;
  }

  public _init(): void {
    this._createResources();
    this.init();
    this.eventBus().emit(Block.EVENTS.RENDER);
  }

  // eslint-disable-next-line class-methods-use-this
  public init(): void { }

  private _componentDidMount(): void {
    this._checkInDom();
    this.componentDidMount();
    Object.values(this.children).forEach((child: Block): void => {
      child.dispatchComponentDidMount();
    });
    this.eventBus().emit(Block.EVENTS.RENDER);
  }

  public componentDidMount(): void { }

  public dispatchComponentDidMount(): void {
    this.eventBus().emit(Block.EVENTS.FLOW_CDM);
    Object.values(this.children).forEach((child) => child.dispatchComponentDidMount());
  }

  private _componentDidUpdate(oldProps: P, newProps: P): void {
    if (this.componentDidUpdate(oldProps, newProps)) {
      this.eventBus().emit(Block.EVENTS.RENDER);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public componentDidUpdate(_oldProps: P, _newProps: P): boolean {
    return true;
  }

  public setProps = (nextProps: P): void => {
    if (!nextProps) {
      return;
    }
    this._prevProps = { ...this.props };
    Object.assign(this.props, nextProps);
  };

  // eslint-disable-next-line no-undef
  get element(): HTMLElement {
    return this._element;
  }

  _componentWillUnmount() {
    this.eventBus().destroy();
    this.componentWillUnmount();
  }

  public componentWillUnmount() {}

  public _render(): void {
    const fragment = this.render();

    if (typeof fragment === 'string') {
      this._element.innerHTML = '';
      this._element.insertAdjacentHTML('afterbegin', fragment);
    } else {
      // TODO: удалить после успешного тестирования replaceWith
      // this._element.innerHTML = '';
      // this._element.append(fragment);

      const newElement = fragment.firstElementChild as HTMLElement;
      this._element!.replaceWith(newElement);
      this._element = newElement;
    }

    this._removeEvents();
    this._addEvents();
    this._addAttribute();
  }

  public render(): DocumentFragment | string {
    return new DocumentFragment();
  }

  public getContent(): HTMLElement {
    // Хак, чтобы вызвать CDM только после добавления в DOM
    if (this.element?.parentNode?.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      setTimeout(() => {
        if (this.element?.parentNode?.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) {
          this.eventBus().emit(Block.EVENTS.FLOW_CDM);
        }
      }, 100);
    }

    return this.element;
  }

  private _makePropsProxy(props: any) {
    const self = this;
    return new Proxy(props, {
      get(target: any, prop: string) {
        const value: unknown = target[prop];
        return typeof value === 'function' ? value.bind(target) : value;
      },
      set(target: any, prop: string, value: unknown): boolean {
        // eslint-disable-next-line no-param-reassign
        target[prop] = value;
        self.eventBus().emit(Block.EVENTS.FLOW_CDU, self._prevProps, target);
        return true;
      },
      deleteProperty() {
        throw new Error('Нет доступа');
      },
    });
  }

  // eslint-disable-next-line class-methods-use-this
  private _createDocumentElement(tagName: string): HTMLElement {
    return document.createElement(tagName);
  }

  public _addEvents(): void {
    const { events = {} } = this.props;
    Object.keys(events).forEach((eventName) => {
      this.events[eventName] = events[eventName].bind('', this);
      this._element.addEventListener(eventName, this.events[eventName]);
    });
  }

  public _removeEvents(): void {
    if (!this.events) return;
    Object.keys(this.events).forEach((eventName) => {
      this._element.removeEventListener(eventName, this.events[eventName]);
    });
  }

  private _addAttribute(): void {
    const { attr = {} } = this.props;
    Object.entries(attr).forEach(([key, value]) => {
      this._element.setAttribute(key, String(value));
    });
  }

  public compile(props: any): DocumentFragment {
    const propsAndStubs = { ...props };
    Object.entries(this.children).forEach(([key, child]: [string, Block]) => {
      propsAndStubs[key] = `<div data-id="${child?._id}"></div>`;
    });

    const fragment = document.createElement('template');
    fragment.innerHTML = '';

    if (this.templator) fragment.innerHTML = this.templator(propsAndStubs);

    Object.values(this.children).forEach((child: Block) => {
      const stub = fragment.content.querySelector(`[data-id="${child._id}"]`);

      stub?.replaceWith(child.getContent());
    });

    return fragment.content;
  }

  // eslint-disable-next-line class-methods-use-this
  private _getChildrenAndProps(propsAndChildren: P): {
    children: Record<string, Block>,
    props: Record<string, unknown>
  } {
    const children: Record<string, Block> = {};
    const props: Record<string, unknown> = {};
    Object.entries(propsAndChildren).forEach(([key, value]) => {
      if (value instanceof Block) {
        children[key] = value;
      } else {
        props[key] = value;
      }
    });
    return { children, props };
  }

  public show(): void {
    const content = this.getContent();
    if (content) content.style.display = '';
  }

  public hide(): void {
    const content = this.getContent();
    if (content) content.style.display = 'none';
  }

  public destroy(): void {
    this._element!.remove();
  }
}
