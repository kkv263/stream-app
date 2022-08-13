<script lang="ts">
  import { supabase } from "$lib/_includes/supabaseClient";
  import { user } from "$lib/stores/sessionStore";
  import { goto } from '$app/navigation';

  let loading = true;
  let username: string | null = null;
  let displayName: string | null = null;
  let firstLogin: boolean;

  const getProfile = async () => {
    try {
      loading = true;
      const user = supabase.auth.user();
      let { data, error, status } = await supabase
        .from("profiles")
        .select(`username, display_name, first_login`)
        .eq("id", user?.id)
        .single();

      if (error && status !== 406) throw error;
      if (data) {
        username = data.username;
        displayName = data.display_name;
        firstLogin = data.first_login;
      }
      if (firstLogin) { return };
      await removeInitialMetadata();

    } catch (error: any) {
      alert(error.message);
    } finally {
      loading = false;
    }
  };

  const removeInitialMetadata = async () => {
    try {
      const user = supabase.auth.user();
      loading = true
      const { error } = await supabase.auth.update({ 
        data: { 
          username: null, 
          display_name: null,
          birthdate: null,
        }
      });

      if (error) throw error;
    } catch(error: any) {
      alert(error.message);
    } finally {
      loading = false;
    }

    try {
      const user = supabase.auth.user();
      loading = true
      const updates = {
        id: user?.id,
        first_login: true,
        updated_at: new Date(),
      };

      let { error } = await supabase.from("profiles").upsert(updates, {
        returning: "minimal", // Don't return the value after inserting
      });

      if (error) throw error;
    } catch(error: any) {
      alert(error.message);
    } finally {
      loading = false;
    }
  }

  const updateProfile = async () => {
    try {
      // https://supabase.com/docs/reference/javascript/auth-update
      loading = true;
      const user = supabase.auth.user();
      const updates = {
        id: user?.id,
        username,
        displayName,
        updated_at: new Date(),
      };

      let { error } = await supabase.from("profiles").upsert(updates, {
        returning: "minimal", // Don't return the value after inserting
      });

      if (error) throw error;
    } catch (error: any) {
      alert(error.message);
    } finally {
      loading = false;
    }
  };

  async function signOut() {
    try {
      loading = true;
      let { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      alert(error.message);
    } finally {
      loading = false;
      goto('/welcome');
    }
  }
</script>

<form use:getProfile class="form-widget" on:submit|preventDefault={updateProfile}>
  <div>
    <label for="email">Email</label>
    <input id="email" type="text" value={$user?.email} disabled />
  </div>
  <div>
    <label for="username">Name</label>
    <input id="username" type="text" bind:value={username} />
  </div>
  <div>
    <label for="website">Display Name</label>
    <input id="displayName" type="text" bind:value={displayName} />
  </div>

  <div>
    <input type="submit" class="button block primary" value={loading ? "Loading ..." : "Update"} disabled={loading}/>
  </div>

  <div>
    <button class="button block" on:click={signOut} disabled={loading}>Sign Out</button>
  </div>
</form>
