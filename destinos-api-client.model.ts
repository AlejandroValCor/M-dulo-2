import { DestinoViaje } from './destino-viaje.model';

@injectable()
export class DestinosApiClient {
	constructor(private store: Store<AppState>) {
	}
	add(d: DestinoViaje){
		this.store.dispatch(new NuevoDestinoAction(d));
	}
	elegir(d: DestinoViaje) {
		this.store.dispatch(new ElegidoFavoritoAction(d));
	}
}
