import { Component, OnInit } from '@angular/core';
import { map, filter, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax'; 

@Component({
  selector: 'app-form-destino-viaje',
  templateUrl: './form-destino-viaje.component.html',
  styleUrls: ['./form-destino-viaje.component.css']
})
export class FormDestinoViajeComponent implements OnInit {
  @Output() onItemAdded: EventEmitter<DestinoViaje>
  fg: FormGroup;
  minLongitud = 3;
  searchResults: string[];

  constructor(fb: FormBuilder) {
  	this.onItemAdded = new EventEmitter();
  	this.fg = fb.group({
  		nombre: ['', Validators.compose([
  		Validators.required,
  		this.nombreValidator,
  		this.nombreValidatorParametrizable(this.minLongitud)
  		])],
  		url: ['', Validators.required]
  	});

  	this.fg.valueChanges.subscribe((form: any) => {
  		console.log('Cambio el formulario: ' form);
  	});
  }

  ngOnInit(): void {
  	const elemNombre = <HTMLInputElement>document.getElementById('nombre');
  	fromEvent(elemNombre, 'input');
  		-pipe(
  		map((e: keyboardEvent) => (e.target as htmlInputElement).value),
  		filter(text => text.length > 2),
  		debounceTime(200),
  		distinctUntilChanged(),
  		switchMap(() => ajax('/assets/datos.json'))
  		).subscribe(ajaxResponse => {
  			console.log(ajaxResponse);
  			console.log(ajaxResponse.response);
  			this.searchResults = ajaxResponse.response;
  		});
  }

  guardar(nombre: string, url: string): boolean {
  	const d = new DestinoViaje(nombre, url);
  	this.onItemAdded.emit(d);
  	return false;
  }

  nombreValidator(control: FormControl): { [s: string]: boolean} {
  	const l = control.value.toString().trim().length;
  	if(l > 0 && l < 5) {
  		return {invalidNombre: true};
  	}

  	return null;
  }

  nombreValidatorParametrizable(minLong: number): validatorFn {
  	return(control: FormControl): { [s: string]: boolean } | null => {
  		const l = control.value.toString().trim().length;
  		if(l > 0 && l < minLong) {
  			return {minLongNombre: true};
  		}
  		return null;
  	}
  }

}
