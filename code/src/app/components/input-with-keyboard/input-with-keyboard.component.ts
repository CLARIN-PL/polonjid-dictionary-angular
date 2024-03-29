import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
} from "@angular/core";
import { isNullOrUndefined } from "util";
import { SidebarService } from "../../services/sidebar.service";
import { HttpService } from "../../services/http.service";
import { FormControl, FormGroup } from "@angular/forms";
import { CurrentStateService } from "../../services/current-state.service";
import { MatAutocompleteTrigger } from "@angular/material/autocomplete";
import { MatKeyboardService } from "angular-onscreen-material-keyboard";
import {
  debounceTime,
  distinctUntilChanged,
  skipWhile,
  takeUntil,
  last,
  finalize,
  skipUntil,
} from "rxjs/operators";

@Component({
  selector: "app-input-with-keyboard",
  templateUrl: "./input-with-keyboard.component.html",
  styleUrls: ["./input-with-keyboard.component.scss"],
})
export class InputWithKeyboardComponent implements OnInit {
  @Input() model: string;
  @Input("floatingSearch") floatingAdvancedSearchPanel = true;

  @Output() advancedPanelOpen = new EventEmitter<boolean>();
  @Output() usingKeyboard = new EventEmitter<boolean>();

  @ViewChild("panel", { static: true }) el;
  @ViewChild("inputWithKeyboard", { static: true })
  inputWithKeyboard: ElementRef;
  @ViewChild("inputWithKeyboard", {
    read: MatAutocompleteTrigger,
    static: true,
  })
  trigger: MatAutocompleteTrigger;
  @ViewChild("advancedFilters", { static: true }) advancedFilters;

  useKeyboard = true;
  showAdvancedOptions = false;
  searchFormGroup = new FormGroup({
    searchTerm: new FormControl(""),
    showAdvancedOptions: new FormControl(),
    useKeyboard: new FormControl(true),
  });
  // searchTerm: FormControl = new FormControl();
  autoCompleteOptions; // = [];

  constructor(
    private state: CurrentStateService,
    private sidebar: SidebarService,
    private http: HttpService,
    private keyboardService: MatKeyboardService
  ) {}

  ngOnInit() {
    this.searchFormGroup.controls.searchTerm.valueChanges.subscribe((term) => {
      if (term !== "") {
        this.autoCompleteOptions = this.http.getSearchAutocomplete(term);
      }
    });
  }

  onSearch() {
    const searchTerm = this.searchFormGroup.value.searchTerm;
    const advancedFilters = this.advancedFilters.get();
    if (searchTerm.length > 0) {
      advancedFilters["lemma"] = searchTerm;
    }
    this.inputWithKeyboard.nativeElement.blur();
    this.keyboardService.dismiss();
    this.sidebar.getAllOptions(advancedFilters);
    this.state.setNavbarOpen(false); // hide navbar
    this.state.setSidebarSearchResultPanelOpen(true); // show sidebar with results
    this.advancedFilters.form.setValue({
      etymological_root: "",
      etymology: "",
      grammatical_gender: "",
      lexical_characteristic: "",
      part_of_speech: "",
      particle_constituent: "",
      particle_prefix: "",
      particle_root: "",
      particle_suffix: "",
      sort_by: "",
      style: "",
      yiddish_domain: "",
      yiddish_domain_modification: "",
      yiddish_status: "",
    });
  }

  showKeyboardSelectorClicked(showKeyboard) {
    if (showKeyboard) {
      setTimeout(() => {
        this.inputWithKeyboard.nativeElement.focus();
      }, 100);
    }
    this.usingKeyboard.emit(showKeyboard);
  }

  toggleAdvancedOptionsChange(event, val) {
    this.panelToggle();
  }

  panelToggle(visible?: boolean) {
    if (isNullOrUndefined(visible)) {
      this.el.toggle();
    } else if (visible) {
      this.el.show();
    } else {
      this.el.close();
    }
    this.showAdvancedOptions = this.el._expanded;
    this.advancedPanelOpen.emit(this.showAdvancedOptions);
  }

  onClickedOutsideAdvancedSearchPanel(event) {
    const classNames = event.className;

    if (!classNames) {
      return;
    }

    if (
      typeof classNames === "object" ||
      classNames.indexOf("cdk-overlay-backdrop") > -1 ||
      classNames.indexOf("mat-option-text") > -1 ||
      classNames.indexOf("mat-option") > -1 ||
      classNames.indexOf("ignore-btn-outside-click") > -1
    ) {
      return;
    }

    this.el.close();
    this.showAdvancedOptions = this.el._expanded;
  }

  modelChanged() {
    if (this.keyboardService.isOpened) {
      this.trigger.panelClosingActions
        .pipe(takeUntil(this.trigger.autocomplete.opened))
        .subscribe(() => {
          if (this.trigger.autocomplete.closed) {
            this.trigger.openPanel();
          }
        });
    }
  }

  optionSelected(event) {
    this.onSearch();
  }

  inputBlured() {
    // console.log(this.keyboardService);
    // console.log('input blured');
  }
}
