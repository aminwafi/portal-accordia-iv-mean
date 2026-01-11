import { Routes } from "@angular/router";

import { ItemCreateComponent } from "./pages/item-create/item-create";
import { ItemEditComponent } from "./pages/item-edit/item-edit";
import { ItemListComponent } from "./pages/item-list/item-list";

const routes: Routes = [
    { path: '', component: ItemListComponent },
    { path: 'new', component: ItemCreateComponent},
    { path: ':id/edit', component: ItemEditComponent }
]

export default routes;