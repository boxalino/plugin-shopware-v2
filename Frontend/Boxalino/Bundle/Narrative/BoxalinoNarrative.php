<?php
abstract class Shopware_Plugins_Frontend_Boxalino_Bundle_Narrative_BoxalinoNarrative
    implements Shopware_Plugins_Frontend_Boxalino_Bundle_Narrative_BoxalinoNarrativeInterface
{
    protected $config;
    protected $container;
    protected $dataHelper;
    protected $helper;
    protected $dependencies;
    protected $response;
    /**
     * @var Shopware_Plugins_Frontend_Boxalino_Bundle_Narrative_Renderer
     */
    protected $renderer;
    protected $viewData;
    protected $main = false;

    /** request information */
    protected $bxRequestUuid;
    protected $bxRequestGroupBy = "products_group_id";
    protected $bxRequestId;

    public function __construct()
    {
        $this->config = Shopware()->Config();
        $this->container = Shopware()->Container();
        $this->dataHelper = Shopware_Plugins_Frontend_Boxalino_Helper_BxData::instance();
        $this->helper = new Shopware_Plugins_Frontend_Boxalino_Helper_BxNarrative();
    }

    abstract function render(&$view);

    /**
     * Get narrative template data which is available by default
     *
     * @return []
     * @throws Exception
     */
    public function getContent()
    {
        return [
            'narrative' => $this->getNarratives(),
            'dependencies' => $this->getDependencies(),
            'narrativeData' => $this->getRenderer()->loadViewElements($this->getNarratives()),
            'bxRender' => $this->getRenderer(),
            'narrative_bx_request_id' => $this->getBxRequestId(),
            'narrative_bx_request_uuid' => $this->getBxRequestUuid(),
            'narrative_bx_request_group_by' => $this->getBxRequestGroupBy()
        ];
    }

    /**
     * get server response
     * @return null
     */
    public function getNarratives()
    {
        return $this->response;
    }

    /**
     * Get View depencies on JS/CSS
     *
     * @return string
     */
    public function getDependencies()
    {
        return $this->dependencies;
    }

    public function setDependencies($dependencies)
    {
        $dependencies = $this->getRenderer()->renderDependencies($dependencies);
        $this->dependencies = $dependencies;

        return $this;
    }

    public function getRenderer()
    {
        return $this->renderer;
    }

    public function setRenderer($renderer)
    {
        $this->renderer = $renderer;
        return $this->renderer;
    }

    public function setResponse($response)
    {
        $this->response = $response;
        return $this;
    }

    public function setViewData($data = [])
    {
        $this->viewData = $data;
        return $this;
    }

    public function setMain($main)
    {
        $this->main = $main;
        return $this;
    }

    public function getHelper()
    {
        return $this->helper;
    }

    public function setChoice($choice)
    {
        $this->choice = $choice;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getBxRequestUuid()
    {
        return $this->bxRequestUuid;
    }

    /**
     * @param mixed $bxRequestUuid
     */
    public function setBxRequestUuid($bxRequestUuid)
    {
        $this->bxRequestUuid = $bxRequestUuid;
        return $this;
    }

    public function getBxRequestGroupBy()
    {
        return $this->bxRequestGroupBy;
    }

    /**
     * @param string $bxRequestGroupBy
     */
    public function setBxRequestGroupBy(string $bxRequestGroupBy)
    {
        $this->bxRequestGroupBy = $bxRequestGroupBy;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getBxRequestId()
    {
        return $this->bxRequestId;
    }

    /**
     * @param mixed $bxRequestId
     */
    public function setBxRequestId($bxRequestId)
    {
        $this->bxRequestId = $bxRequestId;
        return $this;
    }


}