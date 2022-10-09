import { Router, ActivatedRoute } from '@angular/router';
import { PensamentoService } from './../pensamento.service';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
 
@Component({
  selector: 'app-editar-pensamento',
  templateUrl: './editar-pensamento.component.html',
  styleUrls: ['./editar-pensamento.component.css'],
})
export class EditarPensamentoComponent implements OnInit {
  formulario!: FormGroup;
 
  constructor(
    private service: PensamentoService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    console.log('chegou no construtor', this.formulario);
    this.formulario = this.formBuilder.group({
      id: new FormControl(0),
      conteudo: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/(.|\s)*\S(.|\s)*/),
        ])
      ),
      autoria: new FormControl(
        '',
        Validators.compose([Validators.required, Validators.minLength(3)])
      ),
      modelo: new FormControl(''),
    });
    console.log('saindo do construtor', this.formulario);
  }

  ngOnInit(): void {
    console.log('chegou no oninit');

    const id = this.route.snapshot.paramMap.get('id');
    console.log('capturando id da rota, e chammnado buscar por id');
    this.service.buscarPorId(parseInt(id!)).subscribe((pensamento) => {
      //subscribe = aguarda a promessa ser concluida e reternoar algo //
      console.log('retornou do serviço os dados reacionados ao id', pensamento);
      this.formulario = this.formBuilder.group({
        id: new FormControl(pensamento.id),
        conteudo: new FormControl(
          pensamento.conteudo,
          Validators.compose([
            Validators.required,
            Validators.pattern(/(.|\s)*\S(.|\s)*/),
          ])
        ),
        autoria: new FormControl(
          pensamento.autoria,
          Validators.compose([Validators.required, Validators.minLength(3)])
        ),
        modelo: [pensamento.modelo],
        favorito: [pensamento.favorito]
      });
      console.log('foi preenchido o formulario com o pensamneto', pensamento);
    });
    console.log('saindo do Oninit');
  }

  editarPensamento() {
    this.service.editar(this.formulario.value).subscribe(() => {
      this.router.navigate(['/listarPensamento']);
    });
  }

  cancelar() {
    this.router.navigate(['/listarPensamento']);
  }

  habilitarBotao(): string {
    if (this.formulario.valid) {
      return 'botao';
    } else return 'botao__desabilitado';
  }
}
