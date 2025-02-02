/* eslint-disable no-undef */
import Block from '../src/core/Block';
import { rootRouter as router } from '../src/core/Router';
import {RoutePath} from "../src/core/utils/configuration";

describe('Router tests', () => {

    test('Router go', () => {
        router.go(RoutePath.Register);
        expect(window.location.pathname).toBe(RoutePath.Register);
    });

    test('Router back', () => {
        router.go(RoutePath.Register);
        setTimeout(() => {
            router.back();
            expect(window.location.pathname).toBe(RoutePath.Login);
        }, 3000);
    });

    test('Router use', () => {
        router.use({
            pathname: '/test',
            block: Block,
            props: {},
        });
        expect(router.getRoute('/test') !== undefined).toBe(true);
    });
});
