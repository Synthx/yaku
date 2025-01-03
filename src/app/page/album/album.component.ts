import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AlbumStore } from './album.store';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { linkRegex } from '../../util/link';
import { FormFieldComponent } from '../../component/form-field/form-field.component';
import { FormFieldInputDirective } from '../../directive/form-field-input.directive';
import { FormFieldErrorComponent } from '../../component/form-field/form-field-error/form-field-error.component';
import { ButtonComponent } from '../../component/button/button.component';

@Component({
	selector: 'app-album',
	templateUrl: './album.component.html',
	styleUrl: './album.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [AlbumStore],
	imports: [
		ReactiveFormsModule,
		TranslatePipe,
		FormFieldComponent,
		FormFieldInputDirective,
		FormFieldErrorComponent,
		ButtonComponent,
	],
})
export default class AlbumComponent {
	#formBuilder = inject(FormBuilder);
	#store = inject(AlbumStore);

	loading = this.#store.loading;
	searchControl = this.#formBuilder.nonNullable.control('', [
		Validators.required,
		Validators.pattern(linkRegex),
	]);

	async search() {
		if (this.searchControl.invalid) return;

		const link = this.searchControl.getRawValue();
		await this.#store.search(link);
	}
}
