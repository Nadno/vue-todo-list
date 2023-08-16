<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import Popper from 'vue3-popper';

export type DropdownMenuPlacement =
  | 'auto'
  | 'auto-start'
  | 'auto-end'
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'right'
  | 'right-start'
  | 'right-end'
  | 'left'
  | 'left-start'
  | 'left-end';

export type DropdownMenuProps = {
  id: string;
  label?: string;
  orientation?: 'vertical' | 'horizontal';
  autoclose?: boolean;
  placement?: DropdownMenuPlacement;
};

export type DropdownMenuState = {
  open: boolean;
};

const MENU_ITEM_SELECTOR = '[role=menuitem]',
  MENU_ITEM_DISABLED_SELECTOR = '[data-disabled="true"]',
  MENU_ITEM_NO_AUTOCLOSE_SELECTOR = '[data-autoclose="false"]';

const props = withDefaults(defineProps<DropdownMenuProps>(), {
  orientation: 'vertical',
  autoclose: true,
});

const state = reactive<DropdownMenuState>({
    open: false,
  }),
  dropdownRef = ref<{
    container: HTMLElement;
    trigger: HTMLElement;
  } | null>(null);

const triggerId = `trigger[${props.id}]`;

const withDropdownMenuContainer = <TReturn>(
  callback: (menu: HTMLElement) => TReturn,
): TReturn | null => dropdownRef.value && callback(dropdownRef.value.container);

const withDropdownMenuTrigger = <TReturn>(
  callback: (menu: HTMLElement) => TReturn,
): TReturn | null => dropdownRef.value && callback(dropdownRef.value.trigger);

const getDropdownMenuItem = (
  target: HTMLElement | number | 'first' | 'last',
) => {
  const isString = typeof target === 'string',
    isIndex = typeof target === 'number';

  if (isString) {
    return withDropdownMenuContainer(($menu) =>
      $menu.querySelector<HTMLElement>(`${MENU_ITEM_SELECTOR}:${target}-child`),
    );
  }

  return isIndex
    ? withDropdownMenuContainer(
        ($menu) =>
          $menu.querySelector(props.id)?.children[target] as HTMLElement,
      )
    : target;
};

const focusFirstDropdownItem = () => {
  if (!state.open) return;

  withDropdownMenuContainer(($menu) => {
    const $firstItem = getDropdownMenuItem('first');
    if (!$firstItem) return;

    $firstItem.setAttribute('tabindex', '0');
    $menu.addEventListener('transitionend', () => $firstItem.focus(), {
      once: true,
    });
  });
};

watch(() => state.open, focusFirstDropdownItem);

const openDropdownMenu = () => {
    state.open = true;
  },
  closeDropdownMenu = () => {
    state.open = false;
  },
  toggleDropdownMenu = () => (
    state.open ? closeDropdownMenu() : openDropdownMenu(), state.open
  );

const getDropdownMenuItemSibling = (
  position: 'next' | 'previous',
  targetOrIndex: HTMLElement | number,
): HTMLElement | undefined => {
  const isIndex = typeof targetOrIndex === 'number';

  const $root = isIndex
    ? getDropdownMenuItem(targetOrIndex)
    : targetOrIndex.closest<HTMLElement>(MENU_ITEM_SELECTOR);

  if (!$root) return;

  return ($root?.[`${position}ElementSibling`] as HTMLElement) || undefined;
};

const focusDropdownMenuItemSibling = (
  position: 'next' | 'previous',
  targetOrIndex: HTMLElement | number,
) => {
  const $target = getDropdownMenuItem(targetOrIndex);
  if (!$target) return;

  const $next = getDropdownMenuItemSibling(position, $target);
  if (!$next) return;

  $target.setAttribute('tabindex', '-1');
  $next.setAttribute('tabindex', '0');
  $next.focus();
};

const handleNextItem = (e: Event) => {
  const $target = e.target as HTMLElement;
  focusDropdownMenuItemSibling('next', $target);
};

const handlePrevItem = (e: Event) => {
  const $target = e.target as HTMLElement;
  focusDropdownMenuItemSibling('previous', $target);
};

const handleFocusOutside = (e: FocusEvent) => {
  const $target = e.target as HTMLElement;

  withDropdownMenuContainer(($menu) => {
    const $relatedTarget = e.relatedTarget as Node | null,
      isOutsideDropdownMenu =
        !$relatedTarget || !$menu.contains($relatedTarget);

    if (!isOutsideDropdownMenu) return;

    if ($target.matches(MENU_ITEM_SELECTOR))
      $target.setAttribute('tabindex', '-1');

    const $firstItem = getDropdownMenuItem('first');
    if ($firstItem) $firstItem.setAttribute('tabindex', '0');

    closeDropdownMenu();
  });
};

const escapeDropdownMenu = () => {
  closeDropdownMenu();
  withDropdownMenuTrigger(($trigger) =>
    ($trigger.firstElementChild as HTMLElement)?.focus(),
  );
};

const handleAutoClose = (e: Event) => {
  if (!props.autoclose) return;

  const $target = e.target as HTMLElement | null;
  if (!$target || !$target.matches(MENU_ITEM_SELECTOR)) return;

  e.preventDefault();

  const isAutoclose =
    !$target.matches(MENU_ITEM_DISABLED_SELECTOR) &&
    !$target.matches(MENU_ITEM_NO_AUTOCLOSE_SELECTOR);
  if (isAutoclose) escapeDropdownMenu();
};

const isVertical = props.orientation === 'vertical',
  isHorizontal = props.orientation === 'horizontal';
</script>

<template>
  <Popper
    :ref="(ref: any) => {
      dropdownRef = {
        container: ref.$refs.popperContainerNode,
        trigger: ref.$refs.triggerNode,
      }
    }"
    :show="state.open"
    :placement="placement"
    @click="handleAutoClose"
    @keydown.escape="escapeDropdownMenu"
    @keydown.home.prevent="getDropdownMenuItem('first')?.focus()"
    @keydown.end.prevent="getDropdownMenuItem('last')?.focus()"
    @keydown.up.prevent="isVertical && handlePrevItem($event)"
    @keydown.left.prevent="isHorizontal && handlePrevItem($event)"
    @keydown.down.prevent="isVertical && handleNextItem($event)"
    @keydown.right.prevent="isHorizontal && handleNextItem($event)"
    @focusout="handleFocusOutside"
  >
    <slot
      name="menu-trigger"
      :state="state"
      :attrs="({
        id: triggerId,
        'aria-controls': id,
        'aria-haspopup': 'menu',
        'aria-expanded': state.open,
        'data-state': state.open ? 'open' : 'closed',
      } as const)"
      :open="openDropdownMenu"
      :close="closeDropdownMenu"
      :toggle="toggleDropdownMenu"
    />

    <template #content>
      <slot
        :id="id"
        name="menu-content"
        :state="state"
        :attrs="(({
          'role': 'menu',
          'aria-orientation': orientation, 
          'aria-label': label,
          'aria-labelledby': label ? undefined : triggerId,
          'data-orientation': orientation, 
          'data-state': state.open ? 'open' : 'closed',
          'tabindex': -1
        }) as const)"
        :open="openDropdownMenu"
        :close="closeDropdownMenu"
        :toggle="toggleDropdownMenu"
      />
    </template>
  </Popper>
</template>
