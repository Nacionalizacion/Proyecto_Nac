import { Component, OnInit } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-root',
  template: `
    <div class="login-container" *ngIf="!isLoggedIn">
      <div class="login-card">
        <div class="login-left">
          <img [src]="logoUrl" alt="Logo Migraciones" class="logo">
          <i class="pi pi-lock lock-icon"></i>
          <h2 class="system-title">SISTEMA DE NACIONALIZACIÓN</h2>
          <p class="welcome-text">
            Bienvenido al Sistema de Nacionalización de la<br>
            Superintendencia Nacional de Migraciones.
          </p>
        </div>
        
        <div class="login-right">
          <div class="login-form">
            <h2 class="form-title">Iniciar Sesión</h2>
            
            <div class="p-fluid">
              <div class="p-field">
                <label for="username">Usuario</label>
                <input 
                  pInputText 
                  id="username" 
                  type="text" 
                  [(ngModel)]="username"
                  placeholder="Ingrese su nombre de usuario"
                />
              </div>
              
              <div class="p-field">
                <label for="password">Contraseña</label>
                <p-password 
                  id="password" 
                  [(ngModel)]="password"
                  [toggleMask]="true"
                  placeholder="Ingrese su contraseña"
                ></p-password>
              </div>

              <div *ngIf="showCaptcha" class="p-field">
                <label>Código de Verificación</label>
                <div class="captcha-container">
                  <span>{{captchaCode}}</span>
                  <input 
                    pInputText 
                    [(ngModel)]="userCaptcha"
                    placeholder="Ingrese el código"
                  />
                  <button pButton type="button" 
                    label="Refrescar Captcha" 
                    (click)="generateCaptcha()"
                    class="p-button-text">
                  </button>
                </div>
              </div>

              <div *ngIf="errorMessage" class="error-message">
                {{errorMessage}}
              </div>
              
              <p-button 
                label="INGRESAR" 
                (onClick)="login()"
                [disabled]="isSystemBlocked"
                styleClass="p-button-primary"
              ></p-button>
              
              <div class="forgot-password">
                <a href="#" (click)="showResetPassword($event)">¿Olvidaste tu contraseña?</a>
              </div>
              
              <div class="support-text">
                Soporte técnico: 
                <a href="mailto:soporte&#64;migraciones.gob.pe" class="support-email">
                  soporte&#64;migraciones.gob.pe
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="dashboard-container" *ngIf="isLoggedIn">
      <!-- Header -->
      <div class="header">
        <div class="header-left">
          <img [src]="logoUrl" alt="Logo Migraciones" class="dashboard-logo">
          <div class="system-name">
            <span>SISTEMA DE NACIONALIZACIÓN</span>
          </div>
        </div>
        <div class="header-right">
          <div class="notifications">
            <i class="pi pi-bell" [class.has-notifications]="hasNotifications"></i>
          </div>
          <div class="user-profile">
            <span>Sebastián Ramírez - Asistente de registro</span>
            <i class="pi pi-user"></i>
          </div>
        </div>
      </div>

      <div class="main-layout">
        <!-- Sidebar -->
        <div class="sidebar" [class.collapsed]="isSidebarCollapsed">
          <button class="toggle-sidebar" (click)="toggleSidebar()">
            <i class="pi" [ngClass]="{'pi-bars': !isSidebarCollapsed, 'pi-times': isSidebarCollapsed}"></i>
          </button>
          <div class="menu-items">
            <div class="menu-group">
              <div class="menu-item" [class.expanded]="isMenuExpanded('recepcion')" (click)="toggleMenu('recepcion')">
                <i class="pi pi-inbox"></i>
                <span [class.hidden]="isSidebarCollapsed">Recepción</span>
                <i class="pi pi-angle-down" [class.hidden]="isSidebarCollapsed"></i>
              </div>
              <div class="submenu" [class.expanded]="isMenuExpanded('recepcion')" [class.hidden]="isSidebarCollapsed">
                <a href="#" class="submenu-item">Asignación</a>
                <a href="#" class="submenu-item">Reasignación</a>
                <a href="#" class="submenu-item">Verificar Doc. TUPA</a>
              </div>
            </div>
            <div class="menu-item">
              <i class="pi pi-file"></i>
              <span [class.hidden]="isSidebarCollapsed">Evaluación</span>
            </div>
            <div class="menu-item">
              <i class="pi pi-search"></i>
              <span [class.hidden]="isSidebarCollapsed">Búsqueda</span>
            </div>
            <div class="menu-item">
              <i class="pi pi-id-card"></i>
              <span [class.hidden]="isSidebarCollapsed">Emisión del Título</span>
            </div>
            <div class="menu-item" [class.expanded]="isMenuExpanded('consultas')" (click)="toggleMenu('consultas')">
              <i class="pi pi-question-circle"></i>
              <span [class.hidden]="isSidebarCollapsed">Consultas</span>
              <i class="pi pi-angle-down" [class.hidden]="isSidebarCollapsed"></i>
            </div>
            <div class="submenu" [class.expanded]="isMenuExpanded('consultas')" [class.hidden]="isSidebarCollapsed">
              <a href="#" class="submenu-item">Consulta del trámite</a>
            </div>
            <div class="menu-item">
              <i class="pi pi-check-circle"></i>
              <span [class.hidden]="isSidebarCollapsed">Cierre</span>
            </div>
            <div class="menu-item">
              <i class="pi pi-chart-bar"></i>
              <span [class.hidden]="isSidebarCollapsed">Reportes</span>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="main-content">
          <div class="metrics-grid">
            <div class="metric-card">
              <h3>Total de trámites</h3>
              <div class="metric-value">356</div>
              <div class="metric-trend positive">+12% desde el mes pasado</div>
            </div>
            <div class="metric-card">
              <h3>En proceso</h3>
              <div class="metric-value">128</div>
              <div class="metric-detail">120 trámites por asignar</div>
            </div>
            <div class="metric-card">
              <h3>Completados</h3>
              <div class="metric-value">196</div>
              <div class="metric-trend positive">+8% desde el mes pasado</div>
            </div>
            <div class="metric-card">
              <h3>Vencidos</h3>
              <div class="metric-value">32</div>
              <div class="metric-trend negative">-5% desde el mes pasado</div>
            </div>
          </div>

          <div class="recent-procedures">
            <h3>Trámites recientes</h3>
            <p-table [value]="recentProcedures" [paginator]="true" [rows]="5">
              <ng-template pTemplate="header">
                <tr>
                  <th>ID Trámite</th>
                  <th>Tipo</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-procedure>
                <tr>
                  <td>{{procedure.id}}</td>
                  <td>{{procedure.type}}</td>
                  <td>{{procedure.date | date:'dd MMM yyyy, HH:mm:ss'}}</td>
                  <td>
                    <span [class]="'status-badge ' + procedure.status">
                      {{procedure.status}}
                    </span>
                  </td>
                </tr>
              </ng-template>
            </p-table>
          </div>

          <div class="progress-section">
            <h3>Progreso mensual</h3>
            <div class="progress-items">
              <div class="progress-item">
                <span>Trámites asignados</span>
                <div class="progress-bar">
                  <div class="progress" [style.width.%]="78"></div>
                </div>
                <span>78%</span>
              </div>
              <div class="progress-item">
                <span>Trámites evaluados</span>
                <div class="progress-bar">
                  <div class="progress" [style.width.%]="62"></div>
                </div>
                <span>62%</span>
              </div>
              <div class="progress-item">
                <span>Emisión de títulos</span>
                <div class="progress-bar">
                  <div class="progress" [style.width.%]="45"></div>
                </div>
                <span>45%</span>
              </div>
              <div class="progress-item">
                <span>Trámites cerrados</span>
                <div class="progress-bar">
                  <div class="progress" [style.width.%]="35"></div>
                </div>
                <span>35%</span>
              </div>
            </div>
            <div class="additional-metrics">
              <div class="metric">
                <span>Tiempo promedio de procesamiento:</span>
                <strong>12 días</strong>
              </div>
              <div class="metric">
                <span>Eficiencia general:</span>
                <strong>82%</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <span>Versión 1.0.10</span>
        <span class="lovable">lovable</span>
      </div>
    </div>

    <!-- Session Timeout Dialog -->
    <p-dialog 
      [(visible)]="showSessionTimeout" 
      [modal]="true" 
      header="Sesión por expirar">
      <p>Su sesión está por expirar. ¿Desea continuar?</p>
      <div class="dialog-footer">
        <p-button label="Continuar" (onClick)="continueSession()"></p-button>
      </div>
    </p-dialog>

    <!-- Reset Password Dialog -->
    <p-dialog 
      [(visible)]="showPasswordReset" 
      [modal]="true" 
      header="Recuperar Contraseña">
      <div class="reset-password-content">
        <img [src]="logoUrl" alt="Logo Migraciones" class="reset-logo">
        <p>Para recuperar su contraseña, por favor ingrese un correo electrónico de recuperación válido. 
           Tener en cuenta, que este correo debe estar registrado en nuestro sistema; 
           a donde se le enviará un link de recuperación.</p>
        <div class="p-field">
          <input 
            pInputText 
            [(ngModel)]="resetEmail"
            placeholder="Ingrese su correo electrónico"
          />
        </div>
      </div>
      <div class="dialog-footer">
        <p-button label="Recuperar Contraseña" (onClick)="sendResetLink()"></p-button>
        <p-button label="Regresar" (onClick)="closeResetPassword()" styleClass="p-button-text"></p-button>
      </div>
    </p-dialog>

    <p-toast></p-toast>
  `,
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    MessagesModule,
    MessageModule,
    DialogModule,
    ToastModule,
    TableModule,
    CalendarModule,
    DropdownModule,
    ChartModule
  ],
  providers: [MessageService]
})
export class App implements OnInit {
  logoUrl = 'https://drive.google.com/uc?id=1MkgPfYQKooh3hsQj2jPI4OSIP-R6lqpU';
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoggedIn: boolean = false;
  showCaptcha: boolean = false;
  captchaCode: string = '';
  userCaptcha: string = '';
  loginAttempts: number = 0;
  captchaAttempts: number = 0;
  isSystemBlocked: boolean = false;
  sessionTimeout: any;
  showSessionTimeout: boolean = false;
  showPasswordReset: boolean = false;
  resetEmail: string = '';
  isSidebarCollapsed: boolean = false;
  hasNotifications: boolean = true;
  expandedMenus: Set<string> = new Set();

  recentProcedures = [
    {
      id: 'LM250090348',
      type: 'Naturalización',
      date: new Date('2024-02-28T16:33:00'),
      status: 'pendiente'
    },
    {
      id: 'LM250090349',
      type: 'Naturalización',
      date: new Date('2024-02-28T16:34:00'),
      status: 'en-proceso'
    },
    {
      id: 'LM250090350',
      type: 'Naturalización',
      date: new Date('2024-02-28T16:35:00'),
      status: 'completado'
    }
  ];

  constructor(private messageService: MessageService) {}

  ngOnInit() {
    this.startSessionTimer();
  }

  generateCaptcha() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    this.captchaCode = Array(5).fill(0).map(() => 
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('');
  }

  login() {
    if (this.isSystemBlocked) {
      return;
    }

    if (this.showCaptcha) {
      if (this.userCaptcha !== this.captchaCode) {
        this.captchaAttempts++;
        if (this.captchaAttempts >= 10) {
          this.isSystemBlocked = true;
          this.errorMessage = 'Sistema Bloqueado, comuníquese con el administrador';
          return;
        }
        this.errorMessage = 'Código CAPTCHA incorrecto';
        this.generateCaptcha();
        return;
      }
    }

    if (this.username === 'admin' && this.password === '123456') {
      this.isLoggedIn = true;
      this.errorMessage = '';
      this.startSessionTimer();
    } else {
      this.loginAttempts++;
      if (this.loginAttempts >= 5) {
        this.showCaptcha = true;
        if (!this.captchaCode) {
          this.generateCaptcha();
        }
      }
      this.errorMessage = 'Usuario y/o Contraseña son Incorrectos';
    }
  }

  startSessionTimer() {
    if (this.sessionTimeout) {
      clearTimeout(this.sessionTimeout);
    }
    this.sessionTimeout = setTimeout(() => {
      if (this.isLoggedIn) {
        this.showSessionTimeout = true;
        setTimeout(() => {
          if (this.showSessionTimeout) {
            this.logout();
          }
        }, 60000); // 1 minute to respond
      }
    }, 30 * 60 * 1000); // 30 minutes
  }

  continueSession() {
    this.showSessionTimeout = false;
    this.startSessionTimer();
  }

  logout() {
    this.isLoggedIn = false;
    this.showSessionTimeout = false;
    if (this.sessionTimeout) {
      clearTimeout(this.sessionTimeout);
    }
  }

  showResetPassword(event: Event) {
    event.preventDefault();
    this.showPasswordReset = true;
  }

  closeResetPassword() {
    this.showPasswordReset = false;
    this.resetEmail = '';
  }

  sendResetLink() {
    this.messageService.add({
      severity: 'success',
      summary: 'Enlace Enviado',
      detail: 'Se ha enviado un enlace de recuperación a su correo electrónico. El enlace expirará en 5 minutos.'
    });
    this.closeResetPassword();
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  toggleMenu(menuId: string) {
    if (this.expandedMenus.has(menuId)) {
      this.expandedMenus.delete(menuId);
    } else {
      this.expandedMenus.add(menuId);
    }
  }

  isMenuExpanded(menuId: string): boolean {
    return this.expandedMenus.has(menuId);
  }
}

bootstrapApplication(App, {
  providers: [
    importProvidersFrom(BrowserAnimationsModule)
  ]
});