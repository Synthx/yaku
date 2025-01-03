import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
	Overlay,
	type OverlayConfig,
	type OverlayRef,
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { inject, Injectable, Injector } from '@angular/core';
import { ToastComponent } from '../component/toast/toast.component';
import { TOAST_DATA, ToastRef, ToastType } from '../model/toast';

@Injectable({ providedIn: 'root' })
export class ToastService {
	#rootInjector = inject(Injector);
	#overlay = inject(Overlay);
	#breakpointObserver = inject(BreakpointObserver);

	#lastRef?: ToastRef;

	open(content: string, type: ToastType = 'primary'): ToastRef {
		this.#lastRef?.dismiss();

		const overlayRef = this.createOverlayRef();
		const toastRef = new ToastRef(overlayRef);
		this.#lastRef = toastRef;

		const injector = Injector.create({
			parent: this.#rootInjector,
			providers: [
				{ provide: ToastRef, useValue: toastRef },
				{ provide: TOAST_DATA, useValue: { content, type } },
			],
		});

		const componentPortal = new ComponentPortal(ToastComponent, null, injector);
		overlayRef.attach(componentPortal);

		toastRef.dismissAfter(6000);

		return toastRef;
	}

	dismiss(): void {
		this.#lastRef?.dismiss();
	}

	private createOverlayRef(): OverlayRef {
		const isWeb = this.#breakpointObserver.isMatched(Breakpoints.Web);
		const overlayConfig: OverlayConfig = {
			maxWidth: isWeb ? '450px' : '85%',
		};

		overlayConfig.positionStrategy = this.#overlay
			.position()
			.global()
			.right('24px')
			.top('24px');

		return this.#overlay.create(overlayConfig);
	}
}
