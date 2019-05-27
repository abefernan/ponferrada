import { Persona, PersonaAcccount, ProcessedTx } from '../persona';
import { SigningServer } from '../signingServer';
import { Request } from '../signingServer/requestHandler';
import { createBrowserDb, StringDb } from './db';

export interface IovWindowExtension extends Window {
  getQueuedRequests: () => ReadonlyArray<Request>;
  createPersona: (password: string, mnemonic: string | undefined) => Promise<void>;
  loadPersona: (password: string) => Promise<void>;
  createAccount: () => Promise<ReadonlyArray<PersonaAcccount>>;
}

interface PersonaData {
  readonly accounts: ReadonlyArray<PersonaAcccount>;
  readonly mnemonic: string;
  readonly txs: ReadonlyArray<ProcessedTx>;
}

const ALREADY_FOUND_ERR = 'The persona instance is already set. This indicates a bug in the lifecycle.';
const NOT_FOUND_ERR = 'The persona instance is not set. This indicates a bug in the lifecycle.';

export type GetPersonaResponse = PersonaData | null;

class Backgroundscript {
  private persona: Persona | undefined;
  private db: StringDb = createBrowserDb('bs-persona');
  private signingServer = new SigningServer();

  private async createPersona(password: string, mnemonic: string | undefined): Promise<void> {
    if (this.persona) throw new Error(ALREADY_FOUND_ERR);

    this.persona = await Persona.create(this.db, this.signingServer, password, mnemonic);
    this.signingServer.start(this.persona.getCore());
  }

  private async loadPersona(password: string): Promise<void> {
    if (this.persona) throw new Error(ALREADY_FOUND_ERR);

    this.persona = await Persona.load(this.db, this.signingServer, password);
    this.signingServer.start(this.persona.getCore());
  }

  private async createAccount(): Promise<ReadonlyArray<PersonaAcccount>> {
    if (!this.persona) throw new Error(NOT_FOUND_ERR);

    await this.persona.createAccount(this.db);

    return await this.persona.getAccounts();
  }

  public clearPersona(): void {
    if (!this.persona) {
      throw new Error('The persona instance is unset. This indicates a bug in the lifecycle.');
    }
    this.persona.destroy();
    this.persona = undefined;

    this.signingServer.shutdown();
  }

  public registerActionsInBackground(): void {
    (window as IovWindowExtension).getQueuedRequests = this.signingServer.getPendingRequests;
    (window as IovWindowExtension).createPersona = this.createPersona;
    (window as IovWindowExtension).loadPersona = this.loadPersona;
    (window as IovWindowExtension).createAccount = this.createAccount;
  }
}

export default Backgroundscript;
